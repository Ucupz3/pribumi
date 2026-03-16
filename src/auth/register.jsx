const Register = () => {
    return (
        <div>
        <h2>Register</h2>
        <form>
            <input type="text" placeholder="Nama" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Register</button>
        </form>
        </div>
    );
};

export default Register;