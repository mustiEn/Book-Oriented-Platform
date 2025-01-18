import passport from 'passport'
import LocalStrategy from 'passport-local'
import { User } from '../models/User.js'
import { logger } from '../utils/constants.js'


export default passport.use(new LocalStrategy(
    async (username, password, done) => {
        try {
            const user = await User.findOne({
                where: {
                    username: username
                }
            })
            if (!user) {
                throw new Error('Incorrect username.')
            }
            if (!user.password === password) {
                throw new Error('Incorrect password.')
            }
            // logger.log('STRATEGY', user)
            return done(null, user)
        } catch (error) {
            return done(error, null)
        }
    }
))

passport.serializeUser((user, done) => {
    // logger.log('SERIALIZER', user.id)
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    const user = await User.findOne({ where: { id: id } })
    // logger.log('DESERIALIZER', user)
    done(null, user)
})