
'use client'

import { useState } from "react";


export function useLoginViewModel() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    

    const loginWithKakao = async () => {
        setIsLoading(true);
        try {
           const kakaoAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/kakao/login`;
           window.location.href = kakaoAuthUrl;
        } catch (error) {
            setError("로그인에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    }

    return { loginWithKakao, isLoading, error };
}
