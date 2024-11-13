import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SetParking from '../views/SetParkingView.vue';
import ParkingTime from '../views/ParkingTimeView.vue';
import NoticeBoard from '../views/NoticeView.vue';
import InquiryBoard from '../views/InquiryBoardView.vue';
import Notice from '../views/NoticeView.vue';
import BoardDetail from '../views/BoardDetailView.vue';   
import NewBoard from '../views/BoardWriteView.vue';
import ReportListView from '../views/ReportListView.vue';
import ReportDetailView from '../views/ReportDetailView.vue';
import QRcodeView from '../views/QRcodeView.vue';
import QRcodeReportView from '../views/QRcodeReportView.vue';
import ResidentReportView from '../views/ResidentReportView.vue';
import ResidentReportWriteView from '../views/ResidentReportWriteView.vue';
import MapView from '../views/MapView.vue';

import Search from '../views/SearchView.vue';
import DatePicker from '../views/DatePicker.vue';
import PaymentComplete from '../views/PaymentComplete.vue';
import RentListView from '../views/RentListView.vue';
import RentDetail from '../views/RentDetail.vue';
import SearchView from '../views/SearchView.vue';
import ParkingPayment from '../views/ParkingPayment.vue';
import Reservation from '../views/Reservation.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/setParking',
      name: 'setParking',
      component: SetParking,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/timeSet',
      name: 'timeSet',
      component: ParkingTime,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/board',
      name: 'board',
      component: InquiryBoard,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/boardDetail/:noticeId',
      name: 'boardDetail',
      component: BoardDetail,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/newBoard',
      name: 'newBoard',
      component: NewBoard,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/reportList',
      name: 'reportList',
      component: ReportListView,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/reportDetail/:reportId',
      name: 'reportDetail',
      component: ReportDetailView,
      meta: { requiresAuth: true }  // 로그인 필요
    },

    {
      path: '/disabledPersonReportList',
      name: 'disabledPersonReportList',
      component: () => import('../views/disabledPersonReportView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },

    {
      path: '/disabledPersonReportDetail/:disabledPersonReportId',
      name: 'disabledPersonReportDetail',
      component: () => import('../views/disabledPersonReportDetailView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: QRcodeView,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/qrcodereport',
      name: 'qrcodereport',
      component: QRcodeReportView,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/updateRegister',
      name: 'updateRegister',
      component: () => import('../views/UpdateRegisterView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/findId',
      name: 'findId',
      component: () => import('../views/FindIdView.vue'),
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/findPassword',
      name: 'findPassword',
      component: () => import('../views/FindPwView.vue'),
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/updatePw',
      name: 'updatePw',
      component: () => import('../views/UpdatePwView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/exchange',
      name: 'exchange',
      component: () => import('../views/ExchangePointView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: { requiresAuth: false }  // 로그인 페이지
    },
    {
      path: '/residentReport',
      name: 'residentReport',
      component: ResidentReportView,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/residentReportWrite',
      name: 'residentReportWrite',
      component: ResidentReportWriteView,
      meta: { requiresAuth: true },  // 로그인 필요
    },
    {
      path: '/paymentComplete',
      name: 'paymentComplete',
      component: PaymentComplete,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/rentList',
      name: 'rentList',
      component: RentListView,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/rentDetail',
      name: 'rentDetail',
      component: RentDetail,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/search/:destination',
      name: 'searchDestination',
      component: SearchView,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/parkingPay',
      name: 'parkingPay',
      component: ParkingPayment,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/datepicker',
      name: 'datepicker',
      component: DatePicker,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresAuth: false }  // 로그인 필요 없음
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/MainWebView.vue'),
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: Reservation,
      meta: { requiresAuth: true }  // 로그인 필요
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: { requiresAuth: false }  // 로그인 필요 없음
    }
  ]
});

// 로그인 체크를 위한 전역 라우터 가드
router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('userId');  // 세션에서 로그인 여부 확인

  if (to.meta.requiresAuth && !isLoggedIn) {
    // 로그인 필요 페이지에 로그인하지 않은 상태로 접근하면 로그인 페이지로 리디렉션
    next('/login');
  } else {
    next();  // 로그인된 상태이거나 로그인 필요 없는 페이지일 경우 정상 처리
  }
});

export default router;
