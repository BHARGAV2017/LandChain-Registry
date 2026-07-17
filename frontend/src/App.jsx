import { NavLink, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useWallet } from "./hooks/useWallet";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import Verify from "./pages/Verify";
import Contact from "./pages/Contact";

function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function enterDemo() {
  localStorage.setItem("demoEntered", "true");
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { address, connect, loading, chainId, expectedChainId, networkOk } = useWallet();
  const showNetworkWarning =
    expectedChainId != null && chainId != null && !networkOk;
  const isHome = location.pathname === "/";

  const handleSignIn = () => {
    enterDemo();
    navigate("/dashboard");
  };

  return (
    <div className={`app-shell ${isHome ? "app-shell-home" : ""}`}>
      <nav className={`navbar ${isHome ? "navbar-marketing" : ""}`}>
        <Link to="/" className="nav-brand">
          LandChain Registry
        </Link>
        {isHome ? (
          <>
            <div className="nav-links">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/verify">Verify</NavLink>
              <NavLink to="/contact">Contact us</NavLink>
            </div>
            <div className="wallet-bar">
              <button type="button" className="btn" onClick={handleSignIn}>
                Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="nav-links">
              <NavLink to="/" end>
                Home
              </NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/verify">Verify</NavLink>
              <NavLink to="/contact">Contact us</NavLink>
            </div>
            <div className="wallet-bar">
              {address ? (
                <span className="wallet-address" title={address}>
                  {shortAddress(address)}
                </span>
              ) : (
                <button className="secondary" onClick={connect} disabled={loading}>
                  {loading ? "..." : "Connect Wallet"}
                </button>
              )}
            </div>
          </>
        )}
      </nav>
      {showNetworkWarning && !isHome && (
        <div className="alert error network-banner">
          Wrong network detected. Switch MetaMask to Hardhat Local (Chain ID {expectedChainId}).
          <div style={{ marginTop: "0.75rem" }}>
            <button className="secondary" onClick={connect} disabled={loading}>
              {loading ? "Switching..." : "Switch Network"}
            </button>
          </div>
        </div>
      )}
      <main className={isHome ? "main-home" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:parcelId" element={<Verify />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  );
}
