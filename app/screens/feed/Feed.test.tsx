import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feed from './Feed';
import useLoadPosts from './../../hooks/useLoadPosts';
import PostStore from '@/app/stores/post/PostStore';

jest.mock('./../../hooks/useLoadPosts');
jest.mock('@/app/stores/post/PostStore', () => ({
  updateLikes: jest.fn(),
  refreshing: false,
}));

const mockUseLoadPosts = jest.mocked(useLoadPosts);
const mockPostStore = jest.mocked(PostStore);

describe('Feed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing with an empty list', () => {
    mockUseLoadPosts.mockReturnValue({
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      onRefresh: jest.fn(),
    });

    const { getByTestId, getByText } = render(<Feed />);
    expect(getByTestId('feed')).toBeTruthy();
    expect(getByText('No posts')).toBeTruthy();
  });

  test('renders list of posts', () => {
    const mockPosts = [
      { id: 1, user: 'User1', comment: 'Comment1', likes: 0, replies: [], date: '2021-10-01' },
      { id: 2, user: 'User2', comment: 'Comment2', likes: 1, replies: [], date: '2021-10-01' },
    ];

    mockPostStore.posts = mockPosts;
    mockUseLoadPosts.mockReturnValue({
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      onRefresh: jest.fn(),
    });

    const { getByText } = render(<Feed />);
    mockPosts.forEach((post) => {
      expect(getByText(post.comment)).toBeTruthy();
    });
  });

  test('shows loading indicator when loading more posts', () => {
    mockPostStore.isLoading = true
    mockUseLoadPosts.mockReturnValue({
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      onRefresh: jest.fn(),
    });

    const { getByTestId } = render(<Feed />);
    expect(getByTestId('feed')).toBeTruthy();
    expect(getByTestId('activityIndicator')).toBeTruthy();
  });

  test('calls onRefresh when pull to refresh is triggered', async () => {
    const onRefreshMock = jest.fn();
    mockUseLoadPosts.mockReturnValue({
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      onRefresh: onRefreshMock,
    });

    const { getByTestId } = render(<Feed />);
    fireEvent(getByTestId('flatList'), 'onRefresh');
    await waitFor(() => {
      expect(onRefreshMock).toHaveBeenCalled();
    });
  });

  test('calls updateLikes when like button is pressed', () => {
    const mockPosts = [
      { id: 1, user: 'User1', comment: 'Comment1', likes: 0, replies: [], date: '2021-10-01' },
    ];
    mockPostStore.posts = mockPosts;
    mockUseLoadPosts.mockReturnValue({
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      onRefresh: jest.fn(),
    });

    const { getByText } = render(<Feed />);
    const likeButton = getByText('Like');
    fireEvent.press(likeButton);

    expect(PostStore.updateLikes).toHaveBeenCalledWith(mockPosts[0].id);
  });
});