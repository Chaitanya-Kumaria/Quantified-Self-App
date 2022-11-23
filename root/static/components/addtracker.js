const addtracker = {
    template: `
    <div class="container">
    <div class="row justify-content-center">
    <div class="col-md-7 shadow-lg p-3 mb-5 bg-white rounded" >
    <h1 class="text-center"> Add a tracker here,</h1>
    
    <form>
   
    <input type='text' name="Tracker_name" id="Tracker_name" placeholder="trackername" v-model="Form_Data.Tracker_name" /><br><br>
    <label for="Tracker_type"> Choose your tracker type: </label>

        <select id = "Tracker_type" name = "Tracker_type" v-model=Form_Data.Tracker_type>

            <option value = "Numerical">Numerical</option>
            <option value = "mcq">Multiple Choice</option>
            <option value = "Time">Time Duration</option>
            <option value = "Boolean">Boolean</option>

        </select><br><br>
        
    <input typetext name='description' placeholder='description' v-model="Form_Data.Tracker_description" required /><br><br>
    <input typetext name='Settings' placeholder='Settings' v-model="Form_Data.settings"  /><br><br>

    <button @click.prevent="addTracker" type="button" class="btn btn-warning"> Click Here to add a tracker </button>
    </form>
    <small> Note : if choosing tracker type Numerical or time duration leave the settings empty</small>
    </div>
    </div>
    </div>`,
    data(){
        return {
            Form_Data: {
              Tracker_name:'',
              Tracker_type: '',
              Tracker_description: '',
              settings:''
            },
          }
    },
    methods:{
       async addTracker(){
        const res = await fetch(`/api/trackers/${localStorage.getItem('user')}`, {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.Form_Data),
          })
          console.log(JSON.stringify(this.FormData))
          if (res.ok) {
            const data = await res.json()
            
            
            console.log(data)
            this.$router.push('/profile/1')
          } else {
            console.log('something went wrong')
          }
        },
      },
}
export default addtracker