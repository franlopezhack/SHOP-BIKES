const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs')

const EMAIL_PATTERN = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
const PASSWORD_PATTERN = /.{8,}/;
const SALT_WORK_FACTOR = 10;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const userSchema = new Schema({
    name: {
        type: String,
        required: 'User name is required',
    },

    email: {
        type: String,
        required: 'User email is required',
        trim: true,
        unique: true,
        lowercase: true,
        match: [EMAIL_PATTERN, 'Email needs at least 3 chars']
    },

    password: {
        type: String,
        required: 'Password is required',
        trim: true,
        match: [PASSWORD_PATTERN, 'Password needs at least 8 chars']
    },

    adress: {
        type: String,
        required: 'Direction adress is required',
    },
    avatar: {
        type: String
    },

    role: {
        type: String,
        enum: ['admin', 'guess'],
        default: 'guess'
    }

}, {
    timestamps: true,
    toJSON: {
        transform: (doc, user) => {
            user.id = user._id;

            delete user._id;
            delete user.__v;
            delete user.password;

            return user
        }
    }
});

//hash de la contraseña
userSchema.pre('save', function (next) {
    if (this.email === ADMIN_EMAIL) {
        this.role = 'admin';
    }
    if (this.isModified('password')) {
        bcrypt.hash(this.password, SALT_WORK_FACTOR)
            .then(hash => {
                this.password = hash;
                next()
            })
            .catch(error => next(error))
    }
})

userSchema.methods.checkPassword = function (passwordToCheck) {
    return bcrypt.compare(passwordToCheck, this.password);
}

userSchema.methods.isAdmin = function () {
    return this.role === 'admin';
}

const User = mongoose.model('User', userSchema);
module.exports = User;