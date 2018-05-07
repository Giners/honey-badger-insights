import React from 'react'
import Typography from 'material-ui/Typography'

const About = () => (
  <div>
    <Typography paragraph>
      Honey Badger Insights is a little app that helps visualize some security
      intelligence data feeds (vulnerabilities or threat intelligence data).
      Specificially the app focuses on data concerning honeypot activity.
    </Typography>
    <Typography paragraph>
      A honeypot is a security mechanism that is set to detect unauthorized
      access of a resource/part of a system. Honeypots consist of data that
      appears to be valuable and a legitimate part of the system when in fact
      the honeypot is actually isolated from the system. The honeypots are
      monitored for those trying to access the system. Once someone has been
      identified as accessing the system they are marked as an attacker as there
      is no reason they ought to be accessing the honeypot unless it was for
      illicit purposes. Once marked as an attacker the system can isolate/block
      the attacker from gaining further access to the real parts of the system.
    </Typography>
    <Typography paragraph>
      The name of the app stems from the fact that the honey badger animal loves
      honey and will go out of its way to obtain it. In fact the honey badger
      loves honey so much that it will try to gain access to honey even when it
      knows it should not by attacking bee hives whilst bees are present (and
      obviously while getting stung from the bees defending the bee hive!). In
      our case the attackers of a honeypot security mechanism are known as honey
      badgers since they love accessing resource/parts of a system they know
      they shouldn&#39;t.
    </Typography>
    <Typography paragraph>
      The app leverages the{' '}
      <a href="https://riskdiscovery.com/honeydb/#about">HoneyDB</a> security
      intelligence data feed to provide a list of the top 25 honey badgers seen
      in the last 24 hours. It then tries to build a profile of the honey badger
      by aggregating further details about the honey badger from the{' '}
      <a href="https://apility.io/">Apility</a> security intelligence data
      feeds.
    </Typography>
    <Typography paragraph>
      I&#39;m very motivated by the ability to learn and solve new problems. I
      started this project as it would provide me an opportunity to learn by
      being hands-on in the security field which I am not well versed in and
      have a desire to learn more about. It also allowed me to further my
      full-stack development skills as it is something that I am teaching
      myself. I&#39;m very interested in taking feedback in regards to security,
      full-stack development, or anything in general so that I can grow. You can
      visit the{' '}
      <a href="https://github.com/Giners/honey-badger-insights">GitHub repo</a>{' '}
      for Honey Badger Insights to open an issue/message me and leave your
      feedback.
    </Typography>
  </div>
)

export default About
