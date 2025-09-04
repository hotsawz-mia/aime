import { SignIn } from "@clerk/nextjs";
import {dark, shadesOfPurple} from "@clerk/themes";

export default function LoginPage() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <SignIn 
            appearance={{
                baseTheme:shadesOfPurple,
                variables: { colorPrimary: 'oklch(76% 0.233 130.85)' },
            }}
            />
        </div>
    );
}