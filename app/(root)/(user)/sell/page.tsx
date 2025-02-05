"use client";

import Loading from "@/components/common/loading";
import CollectionCard from "@/components/ui/collection-card";
import axios from "@/lib/axios-config";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActiveAccount } from "thirdweb/react";

export const dynamic = "force-dynamic";

export default function Page() {
  const account = useActiveAccount();
  const [datas, setDatas] = useState<User>();

  useEffect(() => {
    if (account?.address) {
      (async () => {
        await axios
          .get(`/api/get-user?username=${account?.address}`)
          .then((res) => {
            setDatas(res.data);
          })
          .catch((err) => {
            toast.error(err.response.data.message);
          });
      })();
    }
  }, [account]);

  return (
    <div className="my-8">
      {!datas ? (
        <Loading />
      ) : (
        <div
          className={cn(
            "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
            datas.address && datas.address.length > 0 && "grid"
          )}
        >
          {datas.address && datas.address.length > 0 ? (
            datas.address.map((address: string) => (
              <CollectionCard key={address} address={address} />
            ))
          ) : (
            <p>No address found</p>
          )}
        </div>
      )}
    </div>
  );
}
