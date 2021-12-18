const msg = ({
  board,
  text,
  delete_password,
  created_on,
  bumped_on,
  reported,
  replies = [],
}) => {
  const date = new Date().toISOString()
  return {
    board,
    text,
    delete_password,
    created_on: created_on || date,
    bumped_on: bumped_on || date,
    reported: reported || false,
    replies,
  }
}

const reply = ({ text, delete_password, created_on, reported }) => {
  return {
    text,
    delete_password,
    created_on: created_on || new Date().toISOString(),
    reported: reported || false,
  }
}

module.exports = {
  msg,
  reply,
}
