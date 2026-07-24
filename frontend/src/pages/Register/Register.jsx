import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  async function submit(values) {
    try {
      await auth.register(values);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not create account");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-cloud px-4">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-xl font-black text-white">C</span>
          <div>
            <h1 className="text-xl font-semibold">Create account</h1>
            <p className="text-sm text-slate-500">Start organizing all your Drive storage.</p>
          </div>
        </div>
        <input {...register("name", { required: "Name is required", minLength: { value: 2, message: "Name must be at least 2 characters" } })} placeholder="Name" className="mb-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />
        {errors.name && <p className="mb-2 text-sm text-danger">{errors.name.message}</p>}
        <input {...register("email", { required: "Email is required" })} placeholder="Email" className="mb-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />
        {errors.email && <p className="mb-2 text-sm text-danger">{errors.email.message}</p>}
        <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be at least 8 characters" } })} type="password" placeholder="Password" className="mb-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />
        {errors.password && <p className="mb-3 text-sm text-danger">{errors.password.message}</p>}
        <button className="h-11 w-full rounded-lg bg-primary font-semibold text-white">Create account</button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-primary">Login</Link>
        </p>
      </form>
    </div>
  );
}
