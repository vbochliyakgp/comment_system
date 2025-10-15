import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

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
      },
      {
        name: "Liam Chakraborty",
        email: "liam.chakraborty@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=2",
      },
      {
        name: "Sarah Wilson",
        email: "sarah.wilson@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=3",
      },
      {
        name: "Alex Chen",
        email: "alex.chen@example.com",
        password: "password123",
        avatar: "https://i.pravatar.cc/150?img=4",
      },
    ];

    const users = [];
    for (const userInfo of userData) {
      const user = new User(userInfo);
      await user.save();
      users.push(user);
    }
    console.log("Created users:", users.length);

    // Create a post
    const post = await Post.create({
      title: "Understanding Nested Comment Systems: A Deep Dive",
      content:
        "In this comprehensive guide, we'll explore how modern platforms like Reddit implement nested commenting systems. We'll cover the technical challenges, user experience considerations, and best practices for building scalable comment hierarchies that maintain readability and performance.",
      author: "Tech Insights Team",
      upvotes: 127,
      upvotedBy: [users[0]._id, users[1]._id],
    });
    console.log("Created post:", post.title);

    // Create top-level comments
    const comments = await Comment.create([
      {
        text: "Interesting, I hadn't thought about it this way before. This really opens up new possibilities for how we approach this problem.",
        postId: post._id,
        userId: users[0]._id,
        parentId: null,
        upvotes: 50,
        upvotedBy: [users[1]._id, users[2]._id],
      },
      {
        text: "Great post! Really enjoyed reading this. The insights are valuable and well-presented.",
        postId: post._id,
        userId: users[1]._id,
        parentId: null,
        upvotes: 45,
        upvotedBy: [users[0]._id, users[3]._id],
      },
      {
        text: "I completely agree! This perspective changes everything. Thanks for sharing your thoughts.",
        postId: post._id,
        userId: users[2]._id,
        parentId: null,
        upvotes: 23,
      },
      {
        text: "Could you elaborate more on the third point? I'm curious about the implementation details.",
        postId: post._id,
        userId: users[3]._id,
        parentId: null,
        upvotes: 18,
      },
      {
        text: "This is exactly what I needed to understand the concept better. The examples are very clear.",
        postId: post._id,
        userId: users[0]._id,
        parentId: null,
        upvotes: 35,
      },
      {
        text: "Has anyone tried implementing this in production? I'd love to hear about real-world experiences.",
        postId: post._id,
        userId: users[1]._id,
        parentId: null,
        upvotes: 28,
      },
      {
        text: "The performance implications mentioned here are crucial. This could make or break the user experience.",
        postId: post._id,
        userId: users[2]._id,
        parentId: null,
        upvotes: 42,
      },
      {
        text: "I've been working on something similar but ran into scalability issues. Any tips?",
        postId: post._id,
        userId: users[3]._id,
        parentId: null,
        upvotes: 15,
      },
    ]);
    console.log("Created top-level comments:", comments.length);

    // Create first level nested comments
    const nestedComments = await Comment.create([
      {
        text: "Absolutely! I've been thinking about this for weeks and this finally clicked for me.",
        postId: post._id,
        userId: users[0]._id,
        parentId: comments[0]._id,
        upvotes: 12,
      },
      {
        text: "The examples you provided really helped me understand the concept better. Great work!",
        postId: post._id,
        userId: users[2]._id,
        parentId: comments[1]._id,
        upvotes: 31,
      },
      {
        text: "I'd be happy to explain! The key is in the data structure we use for storing the relationships.",
        postId: post._id,
        userId: users[0]._id,
        parentId: comments[3]._id,
        upvotes: 8,
      },
      {
        text: "Same here! The visual diagrams really made it click for me.",
        postId: post._id,
        userId: users[1]._id,
        parentId: comments[4]._id,
        upvotes: 19,
      },
      {
        text: "We implemented this at our startup and it's been working great so far.",
        postId: post._id,
        userId: users[2]._id,
        parentId: comments[5]._id,
        upvotes: 25,
      },
      {
        text: "The key is proper indexing and caching strategies.",
        postId: post._id,
        userId: users[3]._id,
        parentId: comments[6]._id,
        upvotes: 14,
      },
      {
        text: "What specific issues did you encounter? Maybe we can help troubleshoot.",
        postId: post._id,
        userId: users[0]._id,
        parentId: comments[7]._id,
        upvotes: 7,
      },
      {
        text: "I'm curious about the database design patterns used here.",
        postId: post._id,
        userId: users[1]._id,
        parentId: comments[0]._id,
        upvotes: 16,
      },
      {
        text: "The UX considerations mentioned are spot on. Mobile experience is crucial.",
        postId: post._id,
        userId: users[2]._id,
        parentId: comments[1]._id,
        upvotes: 22,
      },
      {
        text: "Could you share some code examples for the implementation?",
        postId: post._id,
        userId: users[3]._id,
        parentId: comments[3]._id,
        upvotes: 11,
      },
    ]);
    console.log("Created first level nested comments:", nestedComments.length);

    // Create second level nested comments
    const secondLevelComments = await Comment.create([
      {
        text: "I totally agree! The depth of explanation here is impressive.",
        postId: post._id,
        userId: users[1]._id,
        parentId: nestedComments[0]._id,
        upvotes: 9,
      },
      {
        text: "Thanks! I spent a lot of time making sure the examples were clear.",
        postId: post._id,
        userId: users[3]._id,
        parentId: nestedComments[1]._id,
        upvotes: 13,
      },
      {
        text: "Would you mind sharing the specific data structures you used?",
        postId: post._id,
        userId: users[2]._id,
        parentId: nestedComments[2]._id,
        upvotes: 6,
      },
      {
        text: "The diagrams were definitely the highlight for me too!",
        postId: post._id,
        userId: users[0]._id,
        parentId: nestedComments[3]._id,
        upvotes: 8,
      },
      {
        text: "That's awesome! How long did the implementation take?",
        postId: post._id,
        userId: users[1]._id,
        parentId: nestedComments[4]._id,
        upvotes: 12,
      },
      {
        text: "Exactly! Redis caching made a huge difference for us.",
        postId: post._id,
        userId: users[0]._id,
        parentId: nestedComments[5]._id,
        upvotes: 18,
      },
      {
        text: "Mainly performance issues with deep nesting. Any suggestions?",
        postId: post._id,
        userId: users[2]._id,
        parentId: nestedComments[6]._id,
        upvotes: 5,
      },
      {
        text: "I'd recommend using MongoDB's aggregation pipeline for this.",
        postId: post._id,
        userId: users[3]._id,
        parentId: nestedComments[7]._id,
        upvotes: 15,
      },
      {
        text: "Absolutely! The responsive design patterns are crucial.",
        postId: post._id,
        userId: users[0]._id,
        parentId: nestedComments[8]._id,
        upvotes: 10,
      },
      {
        text: "I can share some sample code if that would help!",
        postId: post._id,
        userId: users[1]._id,
        parentId: nestedComments[9]._id,
        upvotes: 7,
      },
    ]);
    console.log(
      "Created second level nested comments:",
      secondLevelComments.length
    );

    // Create third level nested comments
    const thirdLevelComments = await Comment.create([
      {
        text: "The attention to detail really shows in the quality of this post.",
        postId: post._id,
        userId: users[2]._id,
        parentId: secondLevelComments[1]._id,
        upvotes: 4,
      },
      {
        text: "I'd love to see those! Could you share them in a follow-up post?",
        postId: post._id,
        userId: users[3]._id,
        parentId: secondLevelComments[2]._id,
        upvotes: 3,
      },
      {
        text: "About 3 months of development and testing.",
        postId: post._id,
        userId: users[0]._id,
        parentId: secondLevelComments[4]._id,
        upvotes: 6,
      },
      {
        text: "Redis is a game-changer for this type of application.",
        postId: post._id,
        userId: users[1]._id,
        parentId: secondLevelComments[5]._id,
        upvotes: 8,
      },
      {
        text: "Have you tried implementing pagination for deep threads?",
        postId: post._id,
        userId: users[3]._id,
        parentId: secondLevelComments[6]._id,
        upvotes: 4,
      },
      {
        text: "That's a great suggestion! The aggregation pipeline is perfect for this.",
        postId: post._id,
        userId: users[0]._id,
        parentId: secondLevelComments[7]._id,
        upvotes: 9,
      },
      {
        text: "Yes! I'd be happy to share some code examples.",
        postId: post._id,
        userId: users[2]._id,
        parentId: secondLevelComments[9]._id,
        upvotes: 5,
      },
    ]);
    console.log(
      "Created third level nested comments:",
      thirdLevelComments.length
    );

    // Create fourth level nested comments
    const fourthLevelComments = await Comment.create([
      {
        text: "That would be incredibly helpful! Looking forward to it.",
        postId: post._id,
        userId: users[1]._id,
        parentId: thirdLevelComments[1]._id,
        upvotes: 2,
      },
      {
        text: "That's a reasonable timeline for such a complex feature.",
        postId: post._id,
        userId: users[2]._id,
        parentId: thirdLevelComments[2]._id,
        upvotes: 3,
      },
      {
        text: "Absolutely! The performance improvement was night and day.",
        postId: post._id,
        userId: users[3]._id,
        parentId: thirdLevelComments[3]._id,
        upvotes: 4,
      },
      {
        text: "I haven't tried that yet, but it sounds like a good approach.",
        postId: post._id,
        userId: users[0]._id,
        parentId: thirdLevelComments[4]._id,
        upvotes: 2,
      },
      {
        text: "The flexibility of aggregation pipelines is amazing for complex queries.",
        postId: post._id,
        userId: users[1]._id,
        parentId: thirdLevelComments[5]._id,
        upvotes: 6,
      },
    ]);
    console.log(
      "Created fourth level nested comments:",
      fourthLevelComments.length
    );

    // Create fifth level nested comments
    const fifthLevelComments = await Comment.create([
      {
        text: "I'll work on putting together a comprehensive example.",
        postId: post._id,
        userId: users[0]._id,
        parentId: fourthLevelComments[0]._id,
        upvotes: 1,
      },
      {
        text: "The key was breaking it down into smaller, manageable phases.",
        postId: post._id,
        userId: users[3]._id,
        parentId: fourthLevelComments[1]._id,
        upvotes: 2,
      },
      {
        text: "It really is! The caching layer made everything so much faster.",
        postId: post._id,
        userId: users[2]._id,
        parentId: fourthLevelComments[2]._id,
        upvotes: 3,
      },
      {
        text: "I'll definitely look into implementing pagination for deep threads.",
        postId: post._id,
        userId: users[1]._id,
        parentId: fourthLevelComments[3]._id,
        upvotes: 1,
      },
    ]);
    console.log(
      "Created fifth level nested comments:",
      fifthLevelComments.length
    );

    // Update post comment count
    await post.updateCommentCount();

    console.log("Database seeded successfully!");
    const totalComments =
      comments.length +
      nestedComments.length +
      secondLevelComments.length +
      thirdLevelComments.length +
      fourthLevelComments.length +
      fifthLevelComments.length;
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
