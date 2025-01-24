import {CreatePost} from "@/components/create-post";
import PosterCard from "@/components/post";
import { ProfileSection } from "@/components/profile-section";
import { PostService } from "@/services/post.service";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
 /*  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      authorName: "John Doe",
      authorRole: "Software Developer",
      authorImage: "/placeholder.svg?height=40&width=40",
      time: "2h ago",
      content: "Just finished building an amazing React component! 🚀 #ReactJS #WebDev",
    },
  ]) */



  const postService = new PostService();
  const { data: posts } = useQuery({
      queryKey: ["list-post"],
      queryFn: async () => await postService.list()
  })

  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-24">
      <div className="wrapper max-w-[70rem] mx-auto my-8 px-4 grid grid-cols-[256px_1fr] gap-8 items-start">
      <ProfileSection />
   
    <div className="w-full max-w-md">
       <CreatePost
      /> 
      <div className="flex flex-col gap-4"> 
      {posts && posts?.length > 0 && posts.map((post) => (
        <PosterCard
          key={post.id}
          data={post}
        />
      ))}
      </div>
      </div>
    </div>
  </main>
  )
}
