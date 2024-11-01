import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SetParking from '../views/SetParkingView.vue';
import ParkingTime from '../views/ParkingTimeView.vue';
import NoticeBoard from '../views/NoticeView.vue';
import InquiryBoard from '../views/InquiryBoardView.vue';
import Notice from '../views/NoticeView.vue';
import BoardDetail from '../views/BoardDetailView.vue';   
import NewBoard from '../views/BoardWriteView.vue';
import Report from '../views/ReportView.vue';
import ReportDetail from '../views/ReportDetailView.vue';
import AboutView from '../views/AboutView.vue';
import QRcodeView from '../views/QRcodeView.vue';
import QRcodeReportView from '../views/QRcodeReportView.vue';
import ResidentReportView from '../views/ResidentReportView.vue' 
import ResidentInputView from '../views/ResidentInputView.vue'
import MapView from '../views/MapView.vue'

import Search from '../views/SearchView.vue';
import Login from '../views/Login.vue';
import PaymentComplete from '../views/PaymentComplete.vue'
import RentListView from '../views/RentListView.vue'
import RentDetail from '../views/RentDetail.vue'
import SearchView from '../views/SearchView.vue'
import ParkingPayment from '../views/ParkingPayment.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setParking',
      name: 'setParking',
      component: SetParking
    },
    {
      path: '/timeSet',
      name: 'timeSet',
      component: ParkingTime
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeBoard
    },
    {
      path: '/board',
      name: 'board',
      component: InquiryBoard
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice
    },
    {
      path: '/boardDetail/:noticeId',  // 동적 라우트 경로
      name: 'boardDetail',
      component: BoardDetail
    },
    {
      path: '/newBoard',
      name: 'newBoard',
      component: NewBoard
    },
    {
      path: '/report',
      name: 'report',
      component: Report
    },
    {
      path: '/reportDetail',
      name: 'reportDetail',
      component: ReportDetail
    },
    {
      path: '/about', 
      name: 'about',
      component: AboutView
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: QRcodeView
    },
    {
      path: '/qrcodereport',
      name: 'qrcodereport',
      component: QRcodeReportView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/updateRegister',
      name: 'updateRegister',
      component: () => import('../views/UpdateRegisterView.vue')
    },
    {
      path: '/findId',
      name: 'findId',
      component: () => import('../views/FindIdView.vue')
    },
    {
      path: '/findPassword',
      name: 'findPassword',
      component: () => import('../views/FindPwView.vue')
    },
    {
      path: '/updatePw',
      name: 'updatePw',
      component: () => import('../views/UpdatePwView.vue')
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('../views/ExchangePointView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/residentReport',
      name: 'residentReport',
      component: ResidentReportView
    },
    {
      path: '/residentinput',
      name: 'residentinput',
      component: ResidentInputView,
      props: true,
    },
    {
      path: '/paymentComplete',
      name: 'paymentComplete',
      component: PaymentComplete
    },
    {
      path: '/rentList',
      name: 'rentList',
      component: RentListView
    },
    {
      path: '/rentDetail',
      name: 'rentDetail',
      component: RentDetail
    },
    {
      path: '/search/:destination',
      name: 'searchDestination',
      component: SearchView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    },
    {
      path: '/parkingPay',
      name: 'parkingPay',
      component: ParkingPayment
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    

  ]
  
});

export default router;
