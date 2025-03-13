import express from 'express'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { getMessages, getUsersForSideBars, sendMessage } from '../controllers/message.contoller.js'
const router =express.Router()

router.get("/user",protectRoute,getUsersForSideBars)
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessage)


export default router