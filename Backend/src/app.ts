import express from "express";
import cors from "cors";
import { globalErrorHandler } from "./middlewares/error.middleware";

import authRoutes from "./modules/auth/auth.routes";
import communityRoutes from "./modules/commuinty/community.routes";
import postRoutes from "./modules/posts/post.routes";
import commentRoutes from "./modules/comment/comment.routes";
import likeRoutes from "./modules/like/like.routes";
import savedRoutes from "./modules/saved/saved.routes";
import profileRoutes from "./modules/profile/profile.routes";
import searchRoutes from "./modules/search/search.routes";
import notificationRoutes from "./modules/Notification/notification.routes";
import followRoutes from "./modules/follow/follow.routes";
import messageRoutes from "./modules/message/message.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("server is running");

});

app.use(globalErrorHandler);

export default app;
