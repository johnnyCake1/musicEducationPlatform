import PrivateRoute from "./PrivateRoute";
import Navigation from "./Navigation";
import Sidebar from "./Sidebar";
import '../../App.css'

function withSidebarAndAuth(PageComponent) {
    return (
        <PrivateRoute>
            <div className="">
                <Navigation />

                <div className="main_content">
                    {/* <Navigation_old /> */}
                    <PageComponent />
                </div>
                <Sidebar />
            </div>

        </PrivateRoute>
    );
}
export default withSidebarAndAuth;