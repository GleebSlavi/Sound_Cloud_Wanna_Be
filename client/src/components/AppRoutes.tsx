import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import HomeSection from "./home/Section";
import StreamsSection from "./streams/Section";
import ProfileSection from "./profile/Section";
import CreatePlaylistSection from "./profile/profile_info/button_bar/create_playlist/CreatePlaylistSection";
import AddSongSection from "./profile/profile_info/button_bar/add_song/AddSongSection";
import EditProfileSection from "./profile/profile_info/button_bar/edit_profile/EditProfile";
import LoginRegisterMain from "./login_register/Main";
import NavbarAndPlayerBarMain from "./navbar_and_playerbar/NavbarAndPlayerBarMain";
import { useEffect } from "react";
import NotFoundSection from "./not_found/Section";
import PlaylistPageSection from "./playlist/playlist_page/Section";

const AppRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!isValidToken() && isValidRoute(location.pathname)) {
    localStorage.clear();
    navigate("/login");
    }
  }, [navigate, location]);

  const isValidToken = (): boolean => {
    if (token) {
      const tokenDecodedPayload = JSON.parse(atob(token.split(".")[1]));
      const expirationTime = tokenDecodedPayload.exp;
      return Date.now() < expirationTime * 1000;
    }
    return false;
    };

  const isValidRoute = (path: string): boolean => {
  const validRoutes = [
    "/",
    "/streams",
    "/profile",
    "/profile/edit_profile",
    "/profile/add_song",
    "/profile/create_playlist",
    /^\/playlist\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  ];
  return validRoutes.includes(path);
  };

  const isLoggedIn = isValidToken();
  const isValidPath = isValidRoute(location.pathname);

  return (
  <div>
    <Routes>
      <Route path="/login" element={<LoginRegisterMain />} />
      {isLoggedIn && (
        <Route path="/" element={<NavbarAndPlayerBarMain />}>
          <Route index element={<HomeSection />} />
          <Route path="/streams" element={<StreamsSection />} />
          <Route path="/profile">
            <Route index element={<ProfileSection />} />
            <Route path="edit_profile" element={<EditProfileSection />} />
            <Route path="add_song" element={<AddSongSection />} />
            <Route path="create_playlist" element={<CreatePlaylistSection />} />
          </Route>
          <Route path="/playlist/:uuid" element={<PlaylistPageSection />} />
        </Route>
         )}
      {!isValidPath && (  
      <Route path="*" element={<NotFoundSection />} />
       )}
    </Routes>
  </div>
  ); 
}

export default AppRoutes;
