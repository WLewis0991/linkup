import LinkUpLogo from "./LinkUpLogo";

export default function NavBar () {

    return(<>
    <div className="min-w-52 min-h-dvh border-r flex flex-col items-center pt-10 gap-5" >
        <LinkUpLogo />
        <div className="h-1 w-3/4 border-b"> </div>
        <br />
        <h1>Friends</h1>
        <br />
        <h1>Messages</h1>
        <br />
        <h1>Groups</h1>
        <br />
        <h1>Profile</h1>
    </div>
    </>)
}