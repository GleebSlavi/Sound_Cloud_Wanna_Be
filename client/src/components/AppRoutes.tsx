import { Route, Routes } from "react-router-dom";
import HomeSection from "./home/Section";
import StreamsSection from "./streams/Section";
import ProfileSection from "./profile/Section";
import CreatePlaylistSection from "./profile/profile_info/user_profile_info/button_bar/create_playlist/CreatePlaylistSection";
import AddSongSection from "./profile/profile_info/user_profile_info/button_bar/add_song/AddSongSection";
import ChangePasswordSection from "./profile/profile_info/user_profile_info/button_bar/change_password_section.css/ChangePasswordSection";
import LoginRegisterMain from "./login_register/Main";
import NavbarAndPlayerBarMain from "./navbar_and_playerbar/NavbarAndPlayerBarMain";

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<LoginRegisterMain />} />
        <Route path="/" element={<NavbarAndPlayerBarMain />}>
          <Route index element={<HomeSection />} />
          <Route path="/streams" element={<StreamsSection />} />
          <Route path="/profile">
            <Route index element={<ProfileSection />} />
            <Route path="change_password" element={<ChangePasswordSection />} />
            <Route path="add_song" element={<AddSongSection />} />
            <Route path="create_playlist" element={<CreatePlaylistSection />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default AppRoutes;
