import { getCollection } from "@/lib/mongodb";

export default async function Page() {
  const collection = await getCollection();

  // Ví dụ: lấy tất cả các document trong collection
  const documents = await collection.find().toArray();
  console.log(documents);
  return <div>hello world</div>;
}
