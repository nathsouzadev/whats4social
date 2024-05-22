import { Controller, Post, Body } from '@nestjs/common';
import { ClerkService } from './service/clerk.service';
import { CreateClerkDto } from './dto/create-clerk.dto';
import { WebhookEvent } from '@clerk/nextjs/server'
import { ConfigService } from '@nestjs/config';
import { Webhook } from 'svix'

@Controller('clerk')
export class ClerkController {
  constructor(
    private readonly config: ConfigService,
    private readonly clerkService: ClerkService
    ) {}

  @Post()
  create(
    req: Request,
    @Body() createClerkDto: CreateClerkDto
    ) {
    // Get the headers
  const headerPayload = req.headers;
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Create a new Svix instance with your secret.
  const wh = new Webhook(this.config.get<string>('clerk.webhookSecret'));

  let evt: WebhookEvent

  try {
    evt = wh.verify(JSON.stringify(createClerkDto), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }
  
  const { id } = evt.data;
  const eventType = evt.type;
  console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
  console.log('Webhook body:', createClerkDto)
  }
}
