import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Feed from './Feed';
import useLoadPosts from './../../hooks/useLoadPosts';
import PostStore from '@/app/stores/post/PostStore';
import { toJS } from 'mobx';

jest.mock('./../../hooks/useLoadPosts');
jest.mock('@/app/stores/post/PostStore', () => ({
  updateLikes: jest.fn(),
  refreshing: false,
}));

const mockUseLoadPosts = jest.mocked(useLoadPosts);

describe('Feed Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing with an empty list', () => {
    mockUseLoadPosts.mockReturnValue({
      list: [],
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      loadingMore: false,
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
    mockUseLoadPosts.mockReturnValue({
      list: toJS(mockPosts),
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      loadingMore: false,
      onRefresh: jest.fn(),
    });

    const { getByText } = render(<Feed />);
    mockPosts.forEach((post) => {
      expect(getByText(post.comment)).toBeTruthy();
    });
  });

  test('shows loading indicator when loading more posts', () => {
    mockUseLoadPosts.mockReturnValue({
      list: [],
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      loadingMore: true,
      onRefresh: jest.fn(),
    });

    const { getByTestId } = render(<Feed />);
    expect(getByTestId('feed')).toBeTruthy();
    expect(getByTestId('activityIndicator')).toBeTruthy();
  });

  test('calls onRefresh when pull to refresh is triggered', async () => {
    const onRefreshMock = jest.fn();
    mockUseLoadPosts.mockReturnValue({
      list: [],
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      loadingMore: false,
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
    mockUseLoadPosts.mockReturnValue({
      list: toJS(mockPosts),
      onEndReached: jest.fn(),
      emptyListText: 'No posts',
      loadingMore: false,
      onRefresh: jest.fn(),
    });

    const { getByText } = render(<Feed />);
    const likeButton = getByText('Like');
    fireEvent.press(likeButton);

    expect(PostStore.updateLikes).toHaveBeenCalledWith(mockPosts[0].id);
  });
});