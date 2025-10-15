import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const seedData = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log("Cleared existing data");

    const userData = [
      {
        name: "Liam Joshi",
        email: "liam.joshi@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=1",
        createdAt: "2020-11-10T17:34:39.239Z",
      },
      {
        name: "Liam Chakraborty",
        email: "liam.chakraborty@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=2",
        createdAt: "2022-02-06T04:42:17.429Z",
      },
      {
        name: "Lucas Sen",
        email: "lucas.sen@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=3",
        createdAt: "2023-01-11T06:02:06.344Z",
      },
      {
        name: "Liam Patel",
        email: "liam.patel@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=4",
        createdAt: "2021-06-10T08:44:11.910Z",
      },
      {
        name: "Nisha Verma",
        email: "nisha.verma@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=5",
        createdAt: "2021-01-03T20:27:14.951Z",
      },
      {
        name: "Lucas Roy",
        email: "lucas.roy@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=6",
        createdAt: "2021-02-23T10:26:17.594Z",
      },
      {
        name: "Sophia Khan",
        email: "sophia.khan@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=7",
        createdAt: "2022-04-12T10:51:01.511Z",
      },
      {
        name: "Noah Rao",
        email: "noah.rao@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=8",
        createdAt: "2022-02-25T21:12:07.588Z",
      },
      {
        name: "Liam Bhat",
        email: "liam.bhat@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=9",
        createdAt: "2022-11-09T09:34:03.786Z",
      },
      {
        name: "Riya Sen",
        email: "riya.sen@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=10",
        createdAt: "2024-12-26T09:50:50.220Z",
      },
      {
        name: "Ava Rao",
        email: "ava.rao@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=11",
        createdAt: "2025-03-03T19:52:55.759Z",
      },
      {
        name: "Nisha Joshi",
        email: "nisha.joshi@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=12",
        createdAt: "2020-12-30T11:26:51.101Z",
      },
      {
        name: "Riya Bhat",
        email: "riya.bhat@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=13",
        createdAt: "2024-12-14T23:00:28.603Z",
      },
      {
        name: "Arjun Bhat",
        email: "arjun.bhat@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=14",
        createdAt: "2025-06-02T07:13:50.084Z",
      },
      {
        name: "Liam Khan",
        email: "liam.khan@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=15",
        createdAt: "2021-11-01T10:50:56.392Z",
      },
      {
        name: "Amelia Nair",
        email: "amelia.nair@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=16",
        createdAt: "2021-03-27T12:48:07.491Z",
      },
      {
        name: "Amelia Patel",
        email: "amelia.patel@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=17",
        createdAt: "2022-04-03T23:25:41.368Z",
      },
      {
        name: "Ethan Shah",
        email: "ethan.shah@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=18",
        createdAt: "2022-09-19T12:15:40.500Z",
      },
      {
        name: "Rohit Nair",
        email: "rohit.nair@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=19",
        createdAt: "2025-01-06T00:10:34.999Z",
      },
      {
        name: "Rohit Das",
        email: "rohit.das@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=20",
        createdAt: "2022-08-24T10:27:14.362Z",
      },
      {
        name: "Riya Mehta",
        email: "riya.mehta@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=21",
        createdAt: "2023-11-18T21:17:13.924Z",
      },
      {
        name: "Liam Bhat",
        email: "liam.bhat2@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=22",
        createdAt: "2020-10-16T15:54:54.564Z",
      },
      {
        name: "Ava Patel",
        email: "ava.patel@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=23",
        createdAt: "2025-04-21T16:41:31.287Z",
      },
      {
        name: "Nisha Verma",
        email: "nisha.verma2@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=24",
        createdAt: "2023-02-09T19:52:51.378Z",
      },
      {
        name: "Riya Shah",
        email: "riya.shah@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=25",
        createdAt: "2022-03-12T23:25:01.603Z",
      },
      {
        name: "Liam Roy",
        email: "liam.roy@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=26",
        createdAt: "2024-07-24T01:38:30.940Z",
      },
      {
        name: "Mia Nair",
        email: "mia.nair@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=27",
        createdAt: "2021-07-31T04:03:30.613Z",
      },
      {
        name: "Arjun Chakraborty",
        email: "arjun.chakraborty@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=28",
        createdAt: "2024-09-02T03:05:09.710Z",
      },
      {
        name: "Ava Singh",
        email: "ava.singh@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=29",
        createdAt: "2023-10-17T18:57:14.164Z",
      },
      {
        name: "Rohit Shah",
        email: "rohit.shah@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=30",
        createdAt: "2021-10-10T13:41:55.124Z",
      },
    ];

    const userIdMap = new Map();
    const userUuidMap = {
      "9e92ed55-e15c-4cb1-b5ee-1e0278f38b35": 0,
      "67240c02-4120-4b9e-8a53-46deb231f1c2": 1,
      "190e2796-a946-4e87-ab08-2a2f1d04294c": 2,
      "35da3244-d01f-4a0b-b7ae-c0b4f7f09488": 3,
      "bfb3c7e0-f741-40be-bcfc-186e9c219790": 4,
      "22c9e59a-9859-4b1f-9d3d-dee4242ee482": 5,
      "2c612e74-1dad-4f91-8d45-b233585e12b1": 6,
      "8f09e48f-f422-4b14-86f3-0a1363ba3923": 7,
      "b1c995bf-b6cb-4758-8ad4-dfdde8eb887e": 8,
      "c740a93c-99e9-46f2-8e57-cad6232ecb66": 9,
      "cc0588de-70fd-4c20-af6e-297a1a2b94cd": 10,
      "9b0d266c-538e-49c7-bbff-861eb6e1d0bb": 11,
      "540cc3a9-40c7-4f11-bd25-e903c80232b3": 12,
      "966869ae-24d8-4422-9797-41a93a9ce0b5": 13,
      "9f8d23cd-8ad0-4335-9d3c-54325a354ed2": 14,
      "c7bd5c99-df9b-4030-a31b-fdd3fba1a3dc": 15,
      "ae2d6736-cb44-4fa3-9448-8aa2dc617d6c": 16,
      "4ccdd157-3bde-4bb9-b26a-a86c349cf3d3": 17,
      "83528992-7e8c-4042-a18c-2a6d96ef8a45": 18,
      "8020105d-849c-4553-a316-3c2927eb3247": 19,
      "b11dc688-a097-4f57-9da8-6d79dc46b69e": 20,
      "674ab162-ed36-4267-b49b-e79a90d1874b": 21,
      "0c7291b6-21fc-4a88-b945-5be18f3417a4": 22,
      "9bcad024-ee11-423d-8ce5-dab233f45287": 23,
      "a73fc2ad-3c1d-4532-8d2f-00907fcbf045": 24,
      "7b8c293e-fcda-45c0-910e-03620446aed7": 25,
      "aae37746-cefc-4338-bb21-6981b40717dd": 26,
      "d9b5c4a2-6224-43c1-ac0e-fac037a68f24": 27,
      "a0ce8e77-cf55-438c-a133-43a92d5f6893": 28,
      "454cca7e-ae1f-4c55-9003-616237c18ba2": 29,
    };

    const users = [];
    for (let i = 0; i < userData.length; i++) {
      const user = new User(userData[i]);
      await user.save();
      users.push(user);
    }

    Object.entries(userUuidMap).forEach(([uuid, index]) => {
      if (users[index]) {
        userIdMap.set(uuid, users[index]._id);
      }
    });

    console.log("Created users:", users.length);

    const post = await Post.create({
      title:
        "Advanced Web Development Techniques: Building Scalable Applications",
      content:
        "In this comprehensive discussion, we explore modern web development patterns, architectural decisions, and best practices for creating maintainable, scalable applications. From database design to user interface optimization, this post covers the essential concepts every developer should understand.",
      author: "Tech Community",
      upvotes: 245,
      upvotedBy: [users[0]._id, users[1]._id, users[2]._id, users[3]._id],
    });
    console.log("Created post:", post.title);

    const commentsFilePath = path.join(__dirname, "comments.json");
    const commentsData = JSON.parse(fs.readFileSync(commentsFilePath, "utf8"));

    console.log(`Loaded ${commentsData.length} comments from JSON file`);

    const commentIdMap = new Map();
    const commentsToCreate = [];

    const maxPasses = 10;
    let currentPass = 0;
    let commentsData_copy = [...commentsData];

    while (commentsData_copy.length > 0 && currentPass < maxPasses) {
      const remainingComments = [];

      for (const commentData of commentsData_copy) {
        if (
          commentData.parent_id === null ||
          commentIdMap.has(commentData.parent_id)
        ) {
          const userId = userIdMap.get(commentData.user_id);

          if (userId) {
            const commentDoc = {
              text: commentData.text,
              postId: post._id,
              userId: userId,
              parentId: commentData.parent_id
                ? commentIdMap.get(commentData.parent_id)
                : null,
              upvotes: commentData.upvotes,
              upvotedBy: [],
              createdAt: new Date(commentData.created_at),
            };

            commentsToCreate.push({
              ...commentDoc,
              originalId: commentData.id,
            });
          }
        } else {
          remainingComments.push(commentData);
        }
      }

      for (const commentDoc of commentsToCreate) {
        const { originalId, ...docWithoutId } = commentDoc;
        const createdComment = await Comment.create(docWithoutId);
        commentIdMap.set(originalId, createdComment._id);
      }

      console.log(
        `Pass ${currentPass + 1}: Created ${commentsToCreate.length} comments`
      );

      commentsData_copy = remainingComments;
      commentsToCreate.length = 0;
      currentPass++;
    }

    if (commentsData_copy.length > 0) {
      console.log(
        `Warning: ${commentsData_copy.length} comments could not be created due to missing parent references`
      );
    }

    await post.updateCommentCount();

    const totalComments = await Comment.countDocuments();
    console.log("Database seeded successfully!");
    console.log(
      `Created: ${users.length} users, 1 post, ${totalComments} comments`
    );
  } catch (error) {
    console.error("Seeding error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

seedData();
