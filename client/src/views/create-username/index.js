import React from "react"
import localforge from "localforage"
import { v4 as uid } from "uuid"
import css from "./css.module.scss"
import { Form, InputField } from "components/form"
import Button from "components/buttons"

const CreateUsername = props => {
  const user = props.user

  return (
    <Form id="createUsername" onSubmit={onSubmit}>
      <section className={css.section}>
        <InputField
          label="Set your username"
          placeholder="Make it something memerable"
          name="username"
          value={user ? user.username : ""}
        />
        <br />
        <Button form="createUsername">Save Username</Button>
      </section>
    </Form>
  )
  async function onSubmit(e) {
    e.preventDefault()
    let formData = new FormData(e.target)
    let username = formData.get("username")
    if (!user) {
      await localforge.setItem("user", { uid: uid(), username: username })

      refreshPage()
    } else {
      user.username = username
      await localforge.setItem("user", user)
      refreshPage()
    }
  }
  function refreshPage() {
    window.location.reload(false)
  }
}
export default CreateUsername
