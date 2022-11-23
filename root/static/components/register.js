const register = {
    template: `
    <div>
    <form method="POST">
   
    Username:<input type='text' name="username" id="username" placeholder="username" v-model="FormData.username" /><br><br>
    Email:<input type='text' name='email' id='email' placeholder='email' v-model="FormData.email" required /><br><br>
    Password:<input type='password' name='password' placeholder='password' v-model="FormData.password" required /><br><br>
    <input type="submit"/> 
    </form>
    </div>

    `,
    data() {
        return {
          FormData: {
            username:'',
            email: '',
            password: '',
          },
        }
      },
    
      methods: {
        async registerUser() {
          const res = await fetch('/api/user', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.FormData),
          })

          console.log(JSON.stringify(this.FormData))
          if (res.ok) {
            const data = await res.json()
            localStorage.setItem(
              'user',
              this.FormData.username
            )
            console.log(data)
            this.$router.push('/profile/1')
          } else {
            console.log('something went wrong')
          }
        },
      },
}




export default register