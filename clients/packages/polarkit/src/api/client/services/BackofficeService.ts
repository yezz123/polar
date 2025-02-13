/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BackofficePledgeRead } from '../models/BackofficePledgeRead';
import type { InviteCreate } from '../models/InviteCreate';
import type { InviteRead } from '../models/InviteRead';
import type { OrganizationPrivateRead } from '../models/OrganizationPrivateRead';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class BackofficeService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Pledges
   * @returns BackofficePledgeRead Successful Response
   * @throws ApiError
   */
  public pledges(): CancelablePromise<Array<BackofficePledgeRead>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/backoffice/pledges',
    });
  }

  /**
   * Pledges Non Customers
   * @returns BackofficePledgeRead Successful Response
   * @throws ApiError
   */
  public pledgesNonCustomers(): CancelablePromise<Array<BackofficePledgeRead>> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/api/v1/backoffice/pledges/non_customers',
    });
  }

  /**
   * Pledge Approve
   * @returns BackofficePledgeRead Successful Response
   * @throws ApiError
   */
  public pledgeApprove({
    pledgeId,
  }: {
    pledgeId: string,
  }): CancelablePromise<BackofficePledgeRead> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/pledges/approve/{pledge_id}',
      path: {
        'pledge_id': pledgeId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Pledge Mark Pending
   * @returns BackofficePledgeRead Successful Response
   * @throws ApiError
   */
  public pledgeMarkPending({
    pledgeId,
  }: {
    pledgeId: string,
  }): CancelablePromise<BackofficePledgeRead> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/pledges/mark_pending/{pledge_id}',
      path: {
        'pledge_id': pledgeId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Pledge Mark Disputed
   * @returns BackofficePledgeRead Successful Response
   * @throws ApiError
   */
  public pledgeMarkDisputed({
    pledgeId,
  }: {
    pledgeId: string,
  }): CancelablePromise<BackofficePledgeRead> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/pledges/mark_disputed/{pledge_id}',
      path: {
        'pledge_id': pledgeId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Invites Create Code
   * @returns InviteRead Successful Response
   * @throws ApiError
   */
  public invitesCreateCode({
    requestBody,
  }: {
    requestBody: InviteCreate,
  }): CancelablePromise<InviteRead> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/invites/create_code',
      body: requestBody,
      mediaType: 'application/json',
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Invites List
   * @returns InviteRead Successful Response
   * @throws ApiError
   */
  public invitesList(): CancelablePromise<Array<InviteRead>> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/invites/list',
    });
  }

  /**
   * Organization Sync
   * @returns OrganizationPrivateRead Successful Response
   * @throws ApiError
   */
  public organizationSync({
    name,
  }: {
    name: string,
  }): CancelablePromise<OrganizationPrivateRead> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/api/v1/backoffice/organization/sync/{name}',
      path: {
        'name': name,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

}
