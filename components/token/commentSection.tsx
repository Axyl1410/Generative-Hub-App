"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Comment {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
}

export default function CommentSection({ tokenId }: { tokenId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const t = useTranslations("comment");

  // Lấy danh sách comments từ API
  useEffect(() => {
    fetch(`/api/comments?tokenId=${tokenId}`)
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []));
  }, [tokenId]);

  // Gửi comment mới
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tokenId, username: "Guest", content: newComment }),
    });

    if (response.ok) {
      const addedComment = await response.json();
      setComments([addedComment, ...comments]); // Hiển thị ngay lập tức
      setNewComment(""); // Reset ô nhập
    }
  };

  return (
    <div className="mt-4 w-full rounded-lg bg-neutral-100 p-4 shadow-md">
      <h3 className="mb-3 text-lg font-semibold dark:text-black">
        {t("comment")}
      </h3>
      <div className="space-y-3">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-md border bg-gray-50 p-2 shadow-sm"
          >
            <p className="text-sm font-medium">{comment.username}</p>
            <p className="text-gray-700">{comment.content}</p>
            <p className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2">
        <Textarea
          placeholder={t("placeholder")}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />

        <Button type="submit"> {t("submit")}</Button>
      </form>
    </div>
  );
}
