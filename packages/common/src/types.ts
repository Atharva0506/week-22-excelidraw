import { z} from "zod"

export const SignUpScheam = z.object({
    username:z.string().max(12).min(3),
    password:z.string().max(12).min(6),
    email:z.string().email()
})


export const SignInScheam = z.object({
    email:z.string().email(),
    password:z.string().max(12).min(6)
})


export const CreateRoomScheam = z.object({
    name:z.string().max(12).min(3)
})