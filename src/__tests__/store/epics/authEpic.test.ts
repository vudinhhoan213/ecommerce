import { TestScheduler } from "rxjs/testing";
import { of, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  fetchUserProfileEpic,
  loginUserEpic,
} from "../../../store/epics/authEpic";
import {
  fetchUserProfile,
  fetchUserProfileSuccess,
  fetchUserProfileFailed,
  loginUser,
  loginUserSuccess,
  loginUserFailed,
} from "../../../store/auth/authSlice";

// ===== MOCK rxjs/ajax =====
jest.mock("rxjs/ajax", () => ({
  ajax: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedAjax = ajax as jest.Mocked<typeof ajax>;

// ===== HELPER: TestScheduler =====
function createScheduler() {
  return new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });
}

// ============================================================
// TEST SUITE: authEpic
// ============================================================
describe("authEpic", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ──────────────────────────────────────────────────────────
  // fetchUserProfileEpic
  // ──────────────────────────────────────────────────────────
  describe("fetchUserProfileEpic", () => {
    it("should emit fetchUserProfileSuccess on successful API call", (done) => {
      const mockResponse = {
        response: {
          id: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          image: "avatar.jpg",
          gender: "male",
          birthDate: "1990-01-01",
          address: { address: "123 Home St" },
          company: { address: { address: "456 Company Rd" } },
        },
      };

      (mockedAjax.get as jest.Mock).mockReturnValue(of(mockResponse));

      const action$ = of(fetchUserProfile("test-token"));

      fetchUserProfileEpic(action$ as any).subscribe((outputAction) => {
        expect(outputAction.type).toBe(fetchUserProfileSuccess.type);
        expect((outputAction as any).payload.name).toBe("John Doe");
        expect((outputAction as any).payload.avatar).toBe("avatar.jpg");
        done();
      });
    });

    it("should emit fetchUserProfileFailed on API error", (done) => {
      (mockedAjax.get as jest.Mock).mockReturnValue(
        throwError(() => new Error("Network error"))
      );

      const action$ = of(fetchUserProfile("bad-token"));

      fetchUserProfileEpic(action$ as any).subscribe((outputAction) => {
        expect(outputAction.type).toBe(fetchUserProfileFailed.type);
        expect((outputAction as any).payload).toBe("Network error");
        done();
      });
    });
  });

  // ──────────────────────────────────────────────────────────
  // loginUserEpic
  // ──────────────────────────────────────────────────────────
  describe("loginUserEpic", () => {
    it("should emit loginUserSuccess + fetchUserProfile on successful login", (done) => {
      const mockResponse = {
        response: { accessToken: "new-token-123" },
      };

      (mockedAjax.post as jest.Mock).mockReturnValue(of(mockResponse));

      const action$ = of(loginUser({ username: "test", password: "pass123" }));
      const results: any[] = [];

      loginUserEpic(action$ as any).subscribe({
        next: (action) => results.push(action),
        complete: () => {
          // Should emit 2 actions: loginUserSuccess + fetchUserProfile
          expect(results).toHaveLength(2);
          expect(results[0].type).toBe(loginUserSuccess.type);
          expect(results[0].payload).toBe("new-token-123");
          expect(results[1].type).toBe(fetchUserProfile.type);
          expect(results[1].payload).toBe("new-token-123");
          done();
        },
      });
    });

    it("should emit loginUserFailed when no token in response", (done) => {
      const mockResponse = {
        response: {}, // no accessToken or token
      };

      (mockedAjax.post as jest.Mock).mockReturnValue(of(mockResponse));

      const action$ = of(loginUser({ username: "test", password: "pass" }));

      loginUserEpic(action$ as any).subscribe((outputAction) => {
        expect(outputAction.type).toBe(loginUserFailed.type);
        expect((outputAction as any).payload).toBe("Không nhận được token");
        done();
      });
    });

    it("should emit loginUserFailed on API error", (done) => {
      (mockedAjax.post as jest.Mock).mockReturnValue(
        throwError(() => new Error("Invalid credentials"))
      );

      const action$ = of(loginUser({ username: "wrong", password: "wrong" }));

      loginUserEpic(action$ as any).subscribe((outputAction) => {
        expect(outputAction.type).toBe(loginUserFailed.type);
        expect((outputAction as any).payload).toBe("Invalid credentials");
        done();
      });
    });
  });
});
