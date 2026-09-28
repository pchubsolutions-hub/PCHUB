import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ManageProducts from "./admin/ManageProducts";

import EditProduct from "./admin/EditProduct";

import InquiryManagement from "./admin/InquiryManagement";

import AdminLogin from "./admin/AdminLogin";

import AdminVerifyOTP from "./admin/AdminVerifyOTP";

import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

import InvoiceGenerator from "./admin/InvoiceGenerator";

import InvoiceHistory from "./admin/InvoiceHistory";

import EditInvoice from "./admin/EditInvoice";




function App() {
  return (
    <BrowserRouter>
  <ScrollToTop />

  <Navbar />

  <main>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />


/*Admin panel */
{/* Admin Login */}
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

{/* Admin OTP */}
<Route
  path="/admin/verify-otp"
  element={<AdminVerifyOTP />}
/>

{/* Protected Admin Routes */}
<Route element={<ProtectedAdminRoute />}>

  <Route path="/admin" element={<AdminLayout />}>

  <Route
  path="invoices/create"
  element={<InvoiceGenerator />}
/>

<Route
  path="invoices"
  element={<InvoiceHistory />}
/>

<Route
  path="invoices/edit/:id"
  element={<EditInvoice />}
/>

<Route
  path="invoices"
  element={<InvoiceHistory />}
/>

    <Route
      index
      element={<AdminDashboard />}
    />

    <Route
      path="products"
      element={<ManageProducts />}
    />

    <Route
      path="products/add"
      element={<AddProduct />}
    />

    <Route
      path="products/edit/:id"
      element={<EditProduct />}
    />

    <Route
      path="inquiries"
      element={<InquiryManagement />}
    />

  </Route>

</Route>


    </Routes>
  </main>

  <Footer />
</BrowserRouter>
  );
}

export default App;