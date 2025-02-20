import { NextResponse } from "next/server";
import CommentModel from "@/lib/comment-model";
import { dbConnect } from "@/lib/dbConnect";



// Xử lý POST request: Thêm comment vào database
export async function POST(req: Request) {
    // Kết nối MongoDB
    await dbConnect();
    try {
        const body = await req.json();
        console.log("📥 Received Data:", body); // 🔥 Kiểm tra dữ liệu API nhận được

        const { tokenId, username, content } = body;

        // 🔥 Kiểm tra xem có giá trị bị thiếu không
        console.log("Parsed Data:", { tokenId, username, content });

        if (!tokenId || !username || !content) {
            console.error("❌ Missing fields:", { tokenId, username, content });
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();
        const comment = new CommentModel({ tokenId, username, content });
        await comment.save();

        console.log("✅ Saved comment:", comment); // 🔥 Kiểm tra comment đã lưu thành công

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("❌ Error saving comment:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// Xử lý GET request: Lấy danh sách comment theo tokenId
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const tokenId = searchParams.get("tokenId");

        if (!tokenId) {
            return NextResponse.json({ error: "Missing tokenId" }, { status: 400 });
        }

        const comments = await CommentModel.find({ tokenId }).sort({ createdAt: -1 });

        return NextResponse.json(comments, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
