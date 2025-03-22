import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import connectToDatabase from '@/services/mongodb';
import User from '@/models/User';

export async function GET(request) {
    const authToken = request.cookies.get("authToken");

    if (!authToken) {
        return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(authToken.value, new TextEncoder().encode(process.env.TELEGRAM_JWT_TOKEN));
        const { id } = payload;

        await connectToDatabase();
        const user = await User.findOne({ telegram_id: id });

        if (!user || !user.is_admin) {
            return NextResponse.json({ isAdmin: false }, { status: 403 });
        }

        return NextResponse.json({ isAdmin: true });
    } catch (error) {
        console.error("Ошибка в /api/check-admin:", error);
        return NextResponse.json({ error: "Произошла ошибка" }, { status: 500 });
    }
}