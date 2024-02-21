import { BrowserRouter, Route, Routes } from "react-router-dom"
import PageLayout from "./pages/PageLayout"
import PageSignin from "./pages/PageSignin"
import PageUsers from "./pages/PageUsers"
import PageEmployees from "./pages/PageEmployees"
import PageSalaries from "./pages/PageSalaries"
import PageCek from "./pages/PageCek"


const App = () => {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageLayout />}>
          <Route index element={<PageSignin />} />
          <Route path="/users" element={<PageUsers />} />
          <Route path="/employees" element={<PageEmployees />} />
          <Route path="/salaries" element={<PageSalaries />} />
          <Route path="/cek" element={<PageCek/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App