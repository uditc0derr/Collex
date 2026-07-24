import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const auth = useAuth();
  const navigate = useNavigate();

  async function submit(values) {
    try {
      await auth.login(values);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    }
  }

  return <AuthShell title="Welcome back" mode="login" onSubmit={handleSubmit(submit)} register={register} errors={errors} />;
}

function AuthShell({ title, mode, onSubmit, register, errors = {} }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cloud px-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-xl font-black text-white">C</span>
          <div>
            <h1 className="text-xl font-semibold">{title}</h1>
            <p className="text-sm text-slate-500">One Dashboard. Multiple Google Drives.</p>
          </div>
        </div>
        {mode === "register" && <input {...register("name")} placeholder="Name" className="mb-3 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />}
        <input {...register("email", { required: "Email is required" })} placeholder="Email" className="mb-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />
        {errors.email && <p className="mb-2 text-sm text-danger">{errors.email.message}</p>}
        <input {...register("password", { required: "Password is required" })} type="password" placeholder="Password" className="mb-2 h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-primary" />
        {errors.password && <p className="mb-3 text-sm text-danger">{errors.password.message}</p>}
        <button className="h-11 w-full rounded-lg bg-primary font-semibold text-white">{mode === "register" ? "Create account" : "Login"}</button>
        <p className="mt-4 text-center text-sm text-slate-500">
          {mode === "register" ? "Already have an account?" : "New to Collex?"}{" "}
          <Link to={mode === "register" ? "/login" : "/register"} className="font-semibold text-primary">
            {mode === "register" ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </div>
  );
}
