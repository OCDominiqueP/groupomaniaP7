const Home = {
    template: '#home',
}
const identification = {
    template: '<h2>identification</h2>',
}
const inscription = {
    template: '#inscription',
}
const publications = {
    template: '#publications',
}


//router
const router = new VueRouter({
    routes: [
        { path: '/', component: Home },
        { path: '/identification', component: identification },
        { path: '/inscription', component: inscription },
        { path: '/publications', component: publications },
    ]
})

const vue = new Vue({
    router
}).$mount('#app');