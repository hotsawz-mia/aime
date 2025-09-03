import { SignUp } from "@clerk/nextjs";
import {dark, shadesOfPurple} from "@clerk/themes";


export default function RegisterPage() {
    // note because of the catch all route used this works. if you want to use this outside of catchall route, you need
    //  to pass it routing =hash. You can also add an appearance prop from clerk for styling iof you want.
    return (
        
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
    <SignUp
    // routing="hash"
    appearance={{
            baseTheme:shadesOfPurple,
                variables: { colorPrimary: 'oklch(76% 0.233 130.85)' },
            }}
    />
</div>);
}