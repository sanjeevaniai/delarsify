import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Plus, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface CommunityPost {
  id: string;
  title: string;
  content: string;
  category: string;
  created_at: string;
  profiles: {
    display_name: string;
    location?: string;
  };
}

interface CommunityPostsProps {
  user: SupabaseUser;
}

const CommunityPosts = ({ user }: CommunityPostsProps) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'general' });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      // Get profiles separately to avoid join issues
      const profilesData = await supabase
        .from('profiles')
        .select('user_id, display_name, location');

      const postsWithProfiles = data?.map(post => {
        const profile = profilesData.data?.find(p => p.user_id === post.user_id);
        return {
          ...post,
          profiles: {
            display_name: profile?.display_name || 'Anonymous',
            location: profile?.location
          }
        };
      }) || [];

      if (error) throw error;
      setPosts(postsWithProfiles);
    } catch (error: any) {
      toast({
        title: "Error loading posts",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createPost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user.id,
          title: newPost.title.trim(),
          content: newPost.content.trim(),
          category: newPost.category
        });

      if (error) throw error;

      setNewPost({ title: '', content: '', category: 'general' });
      setShowCreateForm(false);
      loadPosts();

      toast({
        title: "Post created",
        description: "Your post has been shared with the community.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'support': return 'bg-primary/10 text-primary';
      case 'tips': return 'bg-green-100 text-green-800';
      case 'questions': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Community Posts</CardTitle>
            <Button onClick={() => setShowCreateForm(!showCreateForm)}>
              <Plus className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </div>
        </CardHeader>

        {showCreateForm && (
          <CardContent className="space-y-4">
            <Input
              placeholder="Post title..."
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            />

            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              className="w-full p-2 border border-input rounded-md bg-background"
            >
              <option value="general">General</option>
              <option value="support">Support</option>
              <option value="tips">Tips & Advice</option>
              <option value="questions">Questions</option>
            </select>

            <Textarea
              placeholder="Share your thoughts, experiences, or questions..."
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              rows={4}
            />

            <div className="flex gap-2">
              <Button onClick={createPost} disabled={isLoading}>
                {isLoading ? "Posting..." : "Post"}
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getCategoryColor(post.category)}>
                        {post.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {post.profiles?.display_name || 'Anonymous'}
                        {post.profiles?.location && ` from ${post.profiles.location}`}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardHeader>

              <CardContent>
                <p className="whitespace-pre-wrap mb-4">{post.content}</p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Button variant="ghost" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Support
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunityPosts;