const login = {
    template: `
      
      <div class="col-md-7">
      <h1> Welcome To Login Page</h1>
      <form action=''>
      Username: <input type='text' name='username' id='username' placeholder='username' v-model="formData.username"/><br><br>
        Email:<input type='text' name='email' id='email' placeholder='email' v-model="formData.email"/><br><br>
        Password:<input type='password' name='password' placeholder='password' v-model="formData.password"/><br><br>
        <button @click.prevent="loginUser" type="button" class="btn btn-success"> Login </button>
      </form>
      </div>
    `,
  
    data() {
      return {
        formData: {
          username:'',
          email: '',
          password: '',
        },
      }
    },
  
    methods: {
      async loginUser() {
        const res = await fetch('/login?include_auth_token', {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.formData),
        })
  
        if (res.ok) {
          const data = await res.json()
          localStorage.setItem(
            'auth-token',
            data.response.user.authentication_token
          )
          localStorage.setItem('user',this.formData.username)
          this.$router.push('/profile/1')
        } else {
          console.log('something went wrong')
        }
      },
    },
  }
  
  export default login

  