import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const RegisterAdmin = () => {
  const navigate = useNavigate();

  const [formRegister, setFormRegister] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Mengatur perubahan input
  const handleChange = (e) => {
    setFormRegister({
      ...formRegister,
      [e.target.name]: e.target.value,
    });
  };

  // Mengirim data registrasi
  const handleRegister = async (e) => {
    e.preventDefault();

    // Validasi password
    if (formRegister.password.length < 6) {
      Swal.fire({
        icon: "warning",
        title: "Password Terlalu Pendek",
        text: "Password minimal 6 karakter!",
      });
      return;
    }

    // Pencocokan password
    if (formRegister.password !== formRegister.confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Password Tidak Cocok",
        text: "Password dan konfirmasi password harus sama!",
      });
      return;
    }

    try {
      // Data yang dikirim ke backend
      const dataRegister = {
        email: formRegister.email,
        username: formRegister.username,
        password: formRegister.password,
      };

      const response = await fetch("http://localhost:3000/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataRegister),
      });

      const result = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Registrasi Gagal",
          text: result.message || "Terjadi kesalahan!",
        });
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data Admin berhasil dibuat",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin/login");
        }
      });
    } catch (error) {
      console.error("Error Register:", error);

      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Tidak dapat terhubung ke server!",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-green-700">
          HewanPedia
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Registrasi Administrator
        </p>

        {/* Form Register */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block mb-2 font-medium">Email</label>

            <input
              type="email"
              name="email"
              value={formRegister.email}
              onChange={handleChange}
              placeholder="Masukkan email"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="block mb-2 font-medium">Username</label>

            <input
              type="text"
              name="username"
              value={formRegister.username}
              onChange={handleChange}
              placeholder="Masukkan username"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 font-medium">Password</label>

            <input
              type="password"
              name="password"
              value={formRegister.password}
              onChange={handleChange}
              placeholder="Masukkan password"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label className="block mb-2 font-medium">
              Konfirmasi Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              value={formRegister.confirmPassword}
              onChange={handleChange}
              placeholder="Masukkan ulang password"
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Tombol Register */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Register
          </button>
        </form>

        {/* Link Login */}
        <p className="text-center text-gray-500 mt-6">
          Sudah memiliki akun?{" "}
          <Link
            to="/admin/login"
            className="text-green-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterAdmin;
