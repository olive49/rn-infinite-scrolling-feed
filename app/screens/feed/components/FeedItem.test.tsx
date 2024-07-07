// FeedItem.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FeedItem from './FeedItem';
import { FeedItemProps } from '@/app/interface';

describe('<FeedItem />', () => {
  const mockProps: FeedItemProps = {
    user: 'Dwight Schrute',
    comment: 'This is a test comment.',
    likes: 10,
    replies: [],
    date: '2024-07-07T12:00:00Z',
    handleOnLike: jest.fn(),
  };

  it('renders correctly with initial props', () => {
    const { getByText } = render(<FeedItem {...mockProps} />);

    expect(getByText(mockProps.user)).toBeTruthy();
    expect(getByText(mockProps.comment)).toBeTruthy();
    expect(getByText(`${mockProps.likes} likes`)).toBeTruthy();
    expect(getByText('0 comments')).toBeTruthy();
    expect(getByText('View Comments')).toBeTruthy();
  });

  it('disables "View Comments" button when there are no replies', () => {
    const { getByText } = render(<FeedItem {...mockProps} />);

    const viewCommentsButton = getByText('View Comments');
    fireEvent.press(viewCommentsButton);

    expect(viewCommentsButton).toBeDisabled();
  });

  it('toggles comments visibility when "View Comments" button is pressed', () => {
    mockProps.replies = [{ id: 1, user: 'Jim Halpert', comment: 'Nice comment!', likes: 5, replies: [], date: '2024-07-07T12:05:00Z' }];

    const { getByText, queryByText } = render(<FeedItem {...mockProps} />);

    const viewCommentsButton = getByText('View Comments');
    fireEvent.press(viewCommentsButton);

    expect(queryByText(`${mockProps.replies.length} comments`)).toBeTruthy();
    expect(getByText('Hide Comments')).toBeTruthy();

    fireEvent.press(viewCommentsButton);

    expect(queryByText('Comments')).toBeNull(); // Comments should be hidden again
    expect(getByText('View Comments')).toBeTruthy(); // "View Comments" button should reappear
  });

  it('calls handleOnLike when "Like" button is pressed', () => {
    const { getByText } = render(<FeedItem {...mockProps} />);

    const likeButton = getByText('Like');
    fireEvent.press(likeButton);

    expect(mockProps.handleOnLike).toHaveBeenCalledTimes(1);
  });
});
