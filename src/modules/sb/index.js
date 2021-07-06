import { createClient } from '@supabase/supabase-js'


export const supabase = createClient(process.env.VUE_APP_SUPABASE_URL, process.env.VUE_APP_SUPABASE_KEY);


async function signup(email, password, name) {
    let { user, session, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if(error) {
        return error;
    }
    return { user, session };
}

async function signin(email, password) {
    let { user, session, error } = await supabase.auth.signIn({
      email: email,
      password: password,
    });
    if(error) {
        return error;
    }
    return { user, session };
}

async function logout() {
    await supabase.auth.signOut();
}

async function update(ob) {
    const { user, error } = await supabase.auth.update({ 
        data: ob
    })
    const userProfile = await user.user_metadata
    return userProfile
    const { data, errors } = await supabase
        .from('profiles')
        .insert([userProfile])
    const response = await data
    console.log('Thank you for signing up', response)
}
async function social(provider) {
    let { user, session, error } = await supabase.auth.signIn({provider: provider});
    console.log({ user, session, error })
}

const sb_session = supabase.auth.session()
const auth = supabase.auth

const categories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*");
  if (error === null) {
    return data;
  }
};

const cities = async () => {
    const { data, error } = await supabase
    .from('cities')
        .select('*')
    if (error === null) {
        return data;
    }
}

const businesses = async () => {
    const { data, error } = await supabase
    .from('businesses')
        .select('*')
    if (error === null) {
        return data;
    }
}

const addcat = async (cat) => {
    const { data, error } = await supabase
      .from("categories")
        .insert([{ name: cat.name, URL: cat.url }]);
    
    return { data, error };
}
const addcit = async (cit) => {
  const { data, error } = await supabase
    .from("cities")
    .insert([{ name: cit.name, path: cit.path }]);

  return { data, error };
};
const addBusiness = async (business) => {
  const { data, error } = await supabase.from("businesses").insert([business]);
  return { data, error };
};

export {
  addBusiness,
  addcit,
  signup,
  signin,
  logout,
  social,
  update,
  sb_session,
  auth,
  businesses,
  cities,
  categories,
  addcat,
};