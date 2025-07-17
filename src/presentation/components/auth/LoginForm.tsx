"use client";

import { Button } from "@/components/ui/button";
import { useLoginViewModel } from "@/presentation/viewmodels/auth/useLoginViewModel";
import { Calendar, MessageCircle } from "lucide-react";

export function LoginForm() {
	const { loginWithKakao, isLoading, error } = useLoginViewModel();

	return (
		<div className="min-h-screen min-w-[320px] max-w-md mx-auto bg-gray-950 flex flex-col">
			{/* 상단 브랜딩 영역 */}
			<div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
				{/* 로고 */}
				<div
					className="w-24 h-24 bg-blue-700/50 rounded-3xl flex items-center justify-center mb-8"
					style={{ boxShadow: "0 0 30px rgba(59, 130, 246, 0.7)" }}
				>
					<Calendar className="w-12 h-12 text-blue-300" />
				</div>

				{/* 제목 */}
				<h1
					className="text-4xl font-bold text-white mb-4"
					style={{ textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" }}
				>
					일정관리
				</h1>

				{/* 설명 */}
				<p className="text-gray-300 text-lg leading-relaxed mb-16">
					효율적인 일정 관리로
					<br />더 나은 하루를 만들어보세요
				</p>
			</div>

			{/* 하단 로그인 버튼 영역 */}
			<div className="px-6 pb-8">
				<Button
					onClick={loginWithKakao}
					disabled={isLoading}
					variant={"kakao"}
					className="w-full h-14 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold text-lg rounded-xl flex items-center justify-center disabled:opacity-50 transition-all duration-200"
				>
					<MessageCircle className="w-6 h-6 mr-3 fill-gray-900 text-gray-900" />
					{isLoading ? "로그인 중..." : "Kakao로 계속하기"}
				</Button>

				{error && (
					<p className="text-red-400 text-center mt-4 text-sm">{error}</p>
				)}
			</div>
		</div>
	);
}

export default LoginForm;
