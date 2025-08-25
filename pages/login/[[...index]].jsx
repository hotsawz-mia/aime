import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
    // note because of the catch all route used this works. if you want to use this outside of catchall route, you need
    //  to pass it routing =hash. You can also add an appearance prop from clerk for styling iof you want.
    return <SignIn
    // routing="hash"
    />;
}