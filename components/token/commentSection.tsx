"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Loader2, MessageSquare, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Comment {
  content: string;
  user_wallet: string;
  timestamp: number;
}

interface CommentSectionProps {
  nft_contract: string;
  token_Id: string;
}

export default function CommentSection({
  nft_contract,
  token_Id,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const t = useTranslations("comment");
  const account = useActiveAccount();

  // Fetch comments from API
  useEffect(() => {
    const fetchComments = async () => {
      setIsFetching(true);
      try {
        const { data } = await axios.get<Comment[]>(
          `/api/comments?nft_contract=${nft_contract}&token_Id=${token_Id}`
        );
        setComments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchComments();
  }, [nft_contract, token_Id]);

  // Submit new comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !account) return;

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/comments", {
        nft_contract,
        token_Id,
        content: newComment,
        user_wallet: account.address,
      });

      if (data) {
        const newCommentData: Comment = {
          content: newComment,
          user_wallet: account.address,
          timestamp: Date.now(),
        };
        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Get user initials from wallet address
  const getInitials = (address: string) => {
    return address.substring(2, 4).toUpperCase();
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-6 w-full rounded-xl bg-neutral-50 p-4 shadow-md dark:bg-neutral-900 md:p-6"
    >
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">{t("comment")}</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
            {comments.length}
          </span>
        </div>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="all">{t("all_comments")}</TabsTrigger>
          <TabsTrigger value="recent">{t("recent")}</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-0">
          {/* Comment Form */}
          <div className="mb-6 rounded-xl border bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
            {account ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <Textarea
                      placeholder={t("placeholder")}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      disabled={isLoading}
                      className="min-h-24 resize-none border-neutral-200 focus-visible:ring-primary dark:border-neutral-700"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="sm"
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 transition-transform" />
                    )}
                    {isLoading ? t("submitting") : t("submit")}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <p className="mb-3 text-neutral-500">{t("connect_wallet")}</p>
                <Button variant="outline">{t("connect")}</Button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <AnimatePresence>
            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <motion.div
                    key={`${comment.user_wallet}-${comment.timestamp}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: "easeOut",
                    }}
                    className="group relative rounded-lg border border-neutral-100 bg-white p-4 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800/40"
                  >
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8 border">
                        <AvatarFallback className="bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                          {getInitials(comment.user_wallet)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-medium text-neutral-800 dark:text-neutral-200">
                            {formatAddress(comment.user_wallet)}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-neutral-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              {formatDistanceToNow(
                                new Date(comment.timestamp),
                                {
                                  addSuffix: true,
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-200 py-12 dark:border-neutral-700">
                <MessageSquare className="mb-2 h-10 w-10 text-neutral-300 dark:text-neutral-600" />
                <p className="text-neutral-500 dark:text-neutral-400">
                  {t("no_comments")}
                </p>
              </div>
            )}
          </AnimatePresence>
        </TabsContent>

        <TabsContent value="recent">
          <AnimatePresence>
            {isFetching ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
              </div>
            ) : (
              <div className="space-y-4">
                {comments
                  .slice()
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .slice(0, 5)
                  .map((comment, index) => (
                    <motion.div
                      key={`recent-${comment.user_wallet}-${comment.timestamp}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                      className="group relative rounded-lg border border-neutral-100 bg-white p-4 transition-all hover:shadow-md dark:border-neutral-800 dark:bg-neutral-800/40"
                    >
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 border">
                          <AvatarFallback className="bg-neutral-200 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                            {getInitials(comment.user_wallet)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <p className="font-medium text-neutral-800 dark:text-neutral-200">
                              {formatAddress(comment.user_wallet)}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-neutral-400">
                              <Clock className="h-3 w-3" />
                              <span>
                                {formatDistanceToNow(
                                  new Date(comment.timestamp),
                                  {
                                    addSuffix: true,
                                  }
                                )}
                              </span>
                            </div>
                          </div>

                          <p className="mt-2 whitespace-pre-wrap text-neutral-700 dark:text-neutral-300">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </AnimatePresence>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
