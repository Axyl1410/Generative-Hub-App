"use client";

import BackButton from "@/components/common/back-button";
import LoadingScreen from "@/components/common/loading-screen";
import MenuSection from "@/components/ui/menu-section";
import { Link } from "@/i18n/routing";
import "@/styles/profile.module.scss";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { useTranslations } from "next-intl";
import React, { Suspense, useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaCamera, FaCopy, FaEthereum , FaEdit } from "react-icons/fa";
import { Blobbie, useActiveAccount } from "thirdweb/react";
import { CollectedPage } from "./collection";
import axios from "axios";
import FormData from "form-data";

const ProfilePage: React.FC = () => {
  const account = useActiveAccount();

  const [joinDate, setJoinDate] = useState<string>("Loading...");
  const [userName, setUserName] = useState<string>("");
  const [avatar, setAvatar] = useState<string>("https://placehold.co/100x100");
  const [coverPhoto, setCoverPhoto] = useState<string>(
    "https://placehold.co/800x400"
  );
  const [newUsername, setNewUsername] = useState<string>(""); // State cho username mới
  const [isEditing, setIsEditing] = useState(false); // State để bật/tắt chế độ chỉnh sửa
  const t = useTranslations("profile");
  const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${NEXT_PUBLIC_SERVER_URL}/api/user/get-user/${account?.address}`
        );
        const data = await response.json();
        setJoinDate(
          data.user.createdAt
            ? new Date(data.user.createdAt).toLocaleDateString()
            : "Unknown"
        );
        setAvatar(data.user.avatar_url || "https://placehold.co/100x100");
        setCoverPhoto(data.user.cover_url || "https://placehold.co/800x400");
        setUserName(data.user.username || "Unknown");
        setNewUsername(data.user.username || ""); // Khởi tạo username mới từ dữ liệu hiện tại
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (account?.address) {
      fetchUserData();
    }
  }, [account?.address]);

  // Xử lý thay đổi avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result as string);
        uploadImage(file, "avatar"); // Gửi ảnh lên server
      };
      reader.readAsDataURL(file);
    }
  };

  // Xử lý thay đổi cover photo
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPhoto(reader.result as string);
        uploadImage(file, "cover"); // Gửi ảnh lên server
      };
      reader.readAsDataURL(file);
    }
  };

  // Hàm upload ảnh lên server
  const uploadImage = async (file: File, type: "avatar" | "cover") => {
    try {
      const formData = new FormData();
      formData.append("wallet_address", account?.address || "");
      if (type === "avatar") {
        formData.append("avatar", file);
      } else {
        formData.append("cover", file);
      }

      const response = await axios.put(
        `${NEXT_PUBLIC_SERVER_URL}/api/user/update-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Image uploaded successfully:", response.data);
      // Cập nhật state nếu cần
      if (type === "avatar") {
        setAvatar(response.data.user.avatar_url || avatar);
      } else {
        setCoverPhoto(response.data.user.cover_url || coverPhoto);
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
    }
  };

  // Hàm cập nhật username
  const handleUsernameUpdate = async () => {
    if (!newUsername || newUsername === userName) return;

    try {
      const formData = new FormData();
      formData.append("wallet_address", account?.address || "");
      formData.append("username", newUsername);

      const response = await axios.put(
        `${NEXT_PUBLIC_SERVER_URL}/api/user/update-user`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUserName(response.data.user.username);
      setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi cập nhật
      console.log("Username updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating username:", error);
    }
  };

  const shortenAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Function copy address
  const [copied, setCopied] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const handleCopy = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setCopied(true);
      setTooltip("Copied!");
      setTimeout(() => {
        setCopied(false);
        setTooltip(null);
      }, 2000);
    }
  };

  // FUNCTION MENU
  const [activeMenu, setActiveMenu] = useState<string>("Collected");

  const renderContent = () => {
    switch (activeMenu) {
      case "Collected":
        return (
          <Suspense fallback={<LoadingContrent />}>
            <CollectedPage />
          </Suspense>
        );
      case "Offers made":
        return <p>{t("displaying_offers")}</p>;
      case "Deals":
        return <p>{t("Displaying_Deals")}</p>;
      case "Created":
        return <p>{t("Displaying_Created")} </p>;
      case "Favorite":
        return <p>{t("Displaying_Favorite_items")} </p>;
      case "Activity":
        return <p>{t("Displaying_Activity")} </p>;
      default:
        return <p>{t("No_items_found_for")} </p>;
    }
  };

  if (!account) return <LoadingScreen />;

  return (
    <div>
      <BackButton className="my-4 h-fit" />
      {/* Header Section */}

      {/* Cover Section */}
      <div className="relative h-32 overflow-hidden rounded-b-md md:h-64 lg:h-80">
        <img
          src={`${NEXT_PUBLIC_SERVER_URL}${coverPhoto}`}
          alt="Cover"
          className="absolute inset-0 h-full w-full cursor-pointer rounded object-cover"
          onClick={() => document.getElementById("coverPhotoInput")?.click()}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverPhotoChange}
          className="hidden"
          id="coverPhotoInput"
        />
        <div className="absolute right-4 top-4 cursor-pointer text-white">
          <FaCamera
            size={16}
            onClick={() => document.getElementById("coverPhotoInput")?.click()}
          />
        </div>
      </div>

      {/* Avatar Section */}
      <div className="relative -mt-16 flex md:-mt-32 md:ml-6">
        <div className="relative">
          <Blobbie
            address={`${account?.address}`}
            className={
              "h-32 w-32 rounded-full border-4 border-white object-cover md:h-48 md:w-48"
            }
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            id="avatarInput"
          />
          <div className="absolute bottom-0 right-0 cursor-pointer text-white">
            <FaCamera
              size={16}
              onClick={() => document.getElementById("avatarInput")?.click()}
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-[18px] font-bold">
              {isEditing ? (
                <Input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  onBlur={handleUsernameUpdate}
                  autoFocus
                  className="w-40"
                />
              ) : (
                userName
              )}
            </h1>
            {!isEditing && (
              <Button
                size="sm"
                variant="light"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit size={16} />
              </Button>
            )}
            <span> | </span>
            {/* Address info */}
            <section className="text-500 flex">
              <div className="">
                <div className="flex items-center">
                  <FaEthereum className="mr-2 text-xl" />
                  <span className="relative">
                    <span
                      onClick={handleCopy}
                      onMouseEnter={() => setTooltip("Copy")}
                      onMouseLeave={() => setTooltip(null)}
                      className="flex cursor-pointer gap-4"
                    >
                      {shortenAddress(account?.address)} <FaCopy size={18} />
                    </span>
                    {tooltip && !copied && (
                      <div className="absolute left-1/2 mt-1 -translate-x-1/2 transform rounded border bg-white px-2 py-1 text-sm text-gray-700">
                        {tooltip}
                      </div>
                    )}
                    {copied && (
                      <div className="absolute left-1/2 mt-1 -translate-x-1/2 transform rounded border bg-white px-2 py-1 text-sm text-green-500">
                        {t("Copied")}
                      </div>
                    )}
                  </span>
                </div>
              </div>
            </section>
            {/* Ngày tham gia sàn */}
            <p className="text-sm text-gray-500">
              {t("Joined")}: {joinDate}
            </p>
          </div>

          <div className="setting cursor-pointer">
            <Dropdown>
              <DropdownTrigger>
                <Button>
                  <BsThreeDots size={24} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="new">
                  <Link href="/profile/setting">{t("Settings")}</Link>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="mt-6 flex overflow-auto">
        <MenuSection
          items={[
            "Collected",
            "Created",
            "Favorited",
            "Sell",
          ]}
          activeItem={activeMenu}
          onItemSelect={setActiveMenu}
          layout="horizontal"
        />
      </div>
      <hr className="mt-6" />
      {/* Items Section */}
      <div className="my-10 text-center">{renderContent()}</div>
    </div>
  );
};

const LoadingContrent = () => {
  return <div className="h-[152px] w-full animate-pulse bg-neutral-600" />;
};

export default ProfilePage;