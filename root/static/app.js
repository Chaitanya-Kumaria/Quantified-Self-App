import profile from './components/profile.js'
import home from './components/home.js'
import login from './components/login.js'
import register from './components/register.js'
import addtracker from './components/addtracker.js'
import view from './components/view.js'
import update from './components/update.js'
import value from './components/value.js'
const routes = [
    {path: '/',component : home},{path:'/profile/:id',component: profile},
    {path: '/login',component : login},{path: '/register',component : register},
    {path: '/addtracker',component : addtracker},{path: '/view/:tracker',component : view},
    {path: '/update/:tracker/:id',component : update},{ path:'/value/:tracker',component: value}

]

const router = new VueRouter({
    routes,
    base:'/',
})

const app = new Vue({
    el: '#app',
    router,
    methods: {
      async logout() {
        const res = await fetch('/logout')
        if (res.ok) {
          localStorage.clear()
          this.$router.push('/')
        } else {
          console.log('could not logout the user')
        }
      },
    },
  })