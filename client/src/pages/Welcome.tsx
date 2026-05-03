export default function Welcome() {

    return( 
        <div>
        <h1 className="text-3xl font-bold mb-4">Welcome to ChatApp!</h1>
        <p className="text-lg mb-6">Connect with friends, family, and communities in real-time. Join chat rooms, share your thoughts, and stay connected wherever you go.</p>
        <div className="flex space-x-4">
            <a href="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Get Started</a>
            <a href="/sign-in" className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">Sign In</a>
        </div>
        </div>
    )
};