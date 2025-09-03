import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    // note because of the catch all route used this works. if you want to use this outside of catchall route, you need
    //  to pass it routing =hash. You can also add an appearance prop from clerk for styling iof you want.
    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto flex items-center justify-center min-h-screen">
                <SignIn />
            </div>
        </div>
    )
}