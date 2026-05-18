import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Hero from './Components/Hero/Hero'
import Aloqa from './Components/Aloqa/Aloqa'
import Joylashuv from './Components/Joylashuv/Joylashuv'
import Students from './Components/Students1/Students'
import Stumenu from './Components/Students1/Stumenu'
import Teachmenu from './Components/Teachers1/Teachmenu'
import Stu5 from './Components/Students1/Stu5'
import Stu8 from './Components/Students1/Stu8'
import Stu11 from './Components/Students1/Stu11'
import Alg from './Components/Teachers2/Alg'
import Bio from './Components/Teachers2/Bio'
import Chiz from './Components/Teachers2/Chiz'
import Fiz from './Components/Teachers2/Fiz'
import Geo from './Components/Teachers2/Geo'
import Infor from './Components/Teachers2/Infor'
import Ing from './Components/Teachers2/Ing'
import Jt from './Components/Teachers2/Jt'
import Kim from './Components/Teachers2/Kim'
import Ona from './Components/Teachers2/Ona'
import Tar from './Components/Teachers2/Tar'
import Tex from './Components/Teachers2/Tex'
import Qabul from './Components/Qabul/Qabul'
import Footer from './Components/Footer/Footer'
import Sharoit from './Components/Sharoit/Sharoit'
import MaktabQabuli from './Components/Qabul/MaktabQabuli'
import QoshimchaDarslar from './Components/Qabul/QoshimchaDarslar'

// Panel sahifalari
import Login from './pages/Login/Login'
import AdminDashboard from './pages/Admin/AdminDashboard'
import TeacherDashboard from './pages/Teacher/TeacherDashboard'
import StudentDashboard from './pages/Student/StudentDashboard'
import ProtectedRoute from './Components/ProtectedRoute'

const App = () => {
  const location = useLocation()

  // Navbar chiqmaydigan sahifalar
  const noNavbarPaths = ['/sm', '/tm', '/qa', '/login', '/admin', '/teacher', '/student']

  // Footer chiqmaydigan sahifalar
  const noFooterPaths = ['/a', '/j', '/sm', '/tm', '/al', '/bi', '/ch', '/fi', '/ge', '/in', '/ing', '/jt', '/ki', '/on', '/ta', '/te', '/s5', '/s8', '/s11', '/qa', '/qd', '/mq', '/login', '/admin', '/teacher', '/student']

  const showNavbar = !noNavbarPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))
  const showFooter = !noFooterPaths.some(p => location.pathname === p || location.pathname.startsWith(p + '/'))

  return (
    <div>
      {showNavbar && <Navbar />}

      <Routes>
        {/* ===== MAVJUD SAHIFALAR (o'zgarishsiz) ===== */}
        <Route path='/al' element={<Alg />} />
        <Route path='/bi' element={<Bio />} />
        <Route path='/ch' element={<Chiz />} />
        <Route path='/fi' element={<Fiz />} />
        <Route path='/ge' element={<Geo />} />
        <Route path='/in' element={<Infor />} />
        <Route path='/ing' element={<Ing />} />
        <Route path='/jt' element={<Jt />} />
        <Route path='/ki' element={<Kim />} />
        <Route path='/on' element={<Ona />} />
        <Route path='/ta' element={<Tar />} />
        <Route path='/te' element={<Tex />} />

        <Route path='/' element={<Hero />} />
        <Route path='/a' element={<Aloqa />} />
        <Route path='/j' element={<Joylashuv />} />
        <Route path='/qa' element={<Qabul />} />

        <Route path='/s' element={<Students />} />
        <Route path='/sm' element={<Stumenu />} />
        <Route path='/s5' element={<Stu5 />} />
        <Route path='/s8' element={<Stu8 />} />
        <Route path='/s11' element={<Stu11 />} />

        <Route path='/tm' element={<Teachmenu />} />
        <Route path='/shar' element={<Sharoit />} />
        <Route path='/mq' element={<MaktabQabuli />} />
        <Route path='/qd' element={<QoshimchaDarslar />} />

        {/* ===== YANGI SAHIFALAR ===== */}
        <Route path='/login' element={<Login />} />

        <Route path='/admin/*' element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path='/teacher/*' element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        <Route path='/student/*' element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
      </Routes>

      {showFooter && <Footer />}
    </div>
  )
}

export default App
