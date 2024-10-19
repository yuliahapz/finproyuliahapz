import CreateStory from "../Story/CreateStory";
import MyFollowingStories from "../Story/MyFollowingStories";

const Navbar = () => {
    return (
        <nav className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
                {/* Tambahkan tombol create story */}
                <CreateStory />
                <MyFollowingStories />
            </div>
        </nav>
    );
};

export default Navbar;
