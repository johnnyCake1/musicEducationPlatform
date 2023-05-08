import React from "react";
import "./ProfilePage.css";

import ProfileCard from "./components/profile_card/ProfileCard";
import About from "./components/about_me/About";
import Courses from "./components/courses/Courses";
import Reviews from "./components/reviews/Reviews";
import Navigation from "../common/Navigation";

function ProfilePage() {
  const cards = [
    {
      image: "https://picsum.photos/300/200?random=1",
      title: "Card 1",
      description: "This is the first card",
    },
    {
      image: "https://picsum.photos/300/200?random=2",
      title: "Card 2",
      description: "This is the second card",
    },
    {
      image: "https://picsum.photos/300/200?random=3",
      title: "Card 3",
      description: "This is the third card",
    },
    {
        image: "https://picsum.photos/300/200?random=4",
        title: "Card 4",
        description: "This is the fourth card",
      },
      {
        image: "https://picsum.photos/300/200?random=5",
        title: "Card 5",
        description: "This is the fifth card",
      },
      {
        image: "https://picsum.photos/300/200?random=6",
        title: "Card 6",
        description: "This is the sixth card",
      },
  ];
  const reviews = [
    {
      id: 1,
      profilePic: 'https://via.placeholder.com/50x50',
      username: 'John Doe',
      rating: 4,
      comment:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam bibendum sapien eu turpis tincidunt convallis. Donec id urna ut elit congue vulputate vel a turpis.',
    },
    {
      id: 2,
      profilePic: 'https://via.placeholder.com/50x50',
      username: 'Jane Doe',
      rating: 5,
      comment:
        'Praesent consectetur lobortis lacus, eu dignissim magna venenatis et. Nulla porttitor eros turpis, in blandit elit consectetur sed.',
    },
    {
      id: 3,
      profilePic: 'https://via.placeholder.com/50x50',
      username: 'Bob Smith',
      rating: 3,
      comment:
        'Vivamus euismod metus sit amet mi placerat, eu fermentum nibh eleifend. Nulla facilisi. Nullam suscipit vehicula erat, eget tincidunt nulla auctor a.',
    },
  ];
  return (
    <div className="profile-wrapper">
      <ProfileCard />
      <About />
      <div className="profile-content">
        <Courses cards={cards} />
        <Reviews reviews={reviews}/>
      </div>
    </div>
  );
}

export default ProfilePage;
