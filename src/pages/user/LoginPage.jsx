import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-6">
            <div className="bg-green-500 p-3 rounded-full text-white mb-2">
              <Leaf size={28} />
            </div>
            <h1 className="text-2xl font-bold text-green-700">Sport Booking</h1>
            <p className="text-sm text-gray-500">Đặt sân nhanh chóng & dễ dàng</p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-green-500"
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus:ring-green-500"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                Nhớ mật khẩu
              </label>
              <a href="#" className="text-green-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Đăng nhập
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">hoặc</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Social login */}
          <Button variant="outline" className="w-full">
            Đăng nhập với Google
          </Button>

          {/* Register */}
          <p className="text-center text-sm mt-6">
            Chưa có tài khoản?{' '}
            <a href="#" className="text-green-600 font-medium hover:underline">
              Đăng ký
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
